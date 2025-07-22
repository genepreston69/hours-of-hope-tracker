-- Create a function to calculate location stats efficiently
-- This function will get the last 1000 entries per location and calculate stats
CREATE OR REPLACE FUNCTION get_location_stats_with_date_filter(
  date_filter_type text DEFAULT 'ytd'
)
RETURNS TABLE (
  location_name text,
  total_hours numeric,
  total_residents numeric,
  entry_count bigint
) AS $$
DECLARE
  filter_date date;
BEGIN
  -- Set the filter date based on the type
  IF date_filter_type = 'mtd' THEN
    filter_date := date_trunc('month', CURRENT_DATE)::date;
  ELSE
    -- Default to 'ytd' (year to date)
    filter_date := date_trunc('year', CURRENT_DATE)::date;
  END IF;

  RETURN QUERY
  WITH location_entries AS (
    -- Get up to 1000 most recent entries per location
    SELECT 
      fl.name as location_name,
      se.hours,
      se.volunteer_count,
      se.date,
      ROW_NUMBER() OVER (PARTITION BY fl.name ORDER BY se.date DESC, se.created_at DESC) as rn
    FROM service_entries se
    JOIN facility_locations fl ON se.facility_location_id = fl.id
    WHERE se.date >= filter_date
  ),
  filtered_entries AS (
    -- Take only the last 1000 entries per location within the date range
    SELECT 
      location_name,
      hours,
      volunteer_count
    FROM location_entries
    WHERE rn <= 1000
  )
  -- Calculate aggregated stats
  SELECT 
    fe.location_name,
    COALESCE(SUM(fe.hours), 0) as total_hours,
    COALESCE(SUM(fe.volunteer_count), 0) as total_residents,
    COUNT(*) as entry_count
  FROM filtered_entries fe
  GROUP BY fe.location_name
  ORDER BY total_hours DESC;
END;
$$ LANGUAGE plpgsql;