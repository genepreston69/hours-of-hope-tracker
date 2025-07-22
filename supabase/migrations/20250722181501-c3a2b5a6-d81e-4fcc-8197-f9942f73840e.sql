-- Drop and recreate the function with last year support
CREATE OR REPLACE FUNCTION public.get_location_stats_with_date_filter(date_filter_type text DEFAULT 'ytd'::text)
 RETURNS TABLE(
   location_name text,
   total_hours numeric,
   total_residents numeric,
   entry_count bigint,
   last_year_hours numeric
 )
 LANGUAGE plpgsql
AS $function$
DECLARE
  current_filter_date date;
  last_year_filter_date date;
BEGIN
  -- Set the filter dates based on the type
  IF date_filter_type = 'mtd' THEN
    current_filter_date := date_trunc('month', CURRENT_DATE)::date;
    last_year_filter_date := date_trunc('month', CURRENT_DATE - interval '1 year')::date;
  ELSIF date_filter_type = 'ly_mtd' THEN
    current_filter_date := date_trunc('month', CURRENT_DATE - interval '1 year')::date;
    last_year_filter_date := NULL;
  ELSIF date_filter_type = 'ly_ytd' THEN
    current_filter_date := date_trunc('year', CURRENT_DATE - interval '1 year')::date;
    last_year_filter_date := NULL;
  ELSE
    -- Default to 'ytd' (year to date)
    current_filter_date := date_trunc('year', CURRENT_DATE)::date;
    last_year_filter_date := date_trunc('year', CURRENT_DATE - interval '1 year')::date;
  END IF;

  RETURN QUERY
  WITH location_entries AS (
    -- Get current period entries
    SELECT 
      fl.name as loc_name,
      se.hours,
      se.volunteer_count,
      se.date,
      CASE 
        WHEN se.date >= current_filter_date THEN false
        WHEN se.date >= last_year_filter_date THEN true
        ELSE NULL
      END as is_last_year,
      ROW_NUMBER() OVER (PARTITION BY fl.name, 
        CASE 
          WHEN se.date >= current_filter_date THEN false
          WHEN se.date >= last_year_filter_date THEN true
          ELSE NULL
        END 
        ORDER BY se.date DESC, se.created_at DESC) as rn
    FROM service_entries se
    JOIN facility_locations fl ON se.facility_location_id = fl.id
    WHERE (se.date >= current_filter_date)
      OR (last_year_filter_date IS NOT NULL AND se.date >= last_year_filter_date AND se.date < current_filter_date)
  ),
  filtered_entries AS (
    -- Take only the last 1000 entries per location per period
    SELECT 
      le.loc_name,
      le.hours,
      le.volunteer_count,
      le.is_last_year
    FROM location_entries le
    WHERE le.rn <= 1000
  ),
  current_period_stats AS (
    -- Calculate current period stats
    SELECT 
      fe.loc_name,
      COALESCE(SUM(CASE WHEN NOT fe.is_last_year THEN fe.hours ELSE 0 END), 0) as current_hours,
      COALESCE(SUM(CASE WHEN NOT fe.is_last_year THEN fe.volunteer_count ELSE 0 END), 0) as current_residents,
      COUNT(CASE WHEN NOT fe.is_last_year THEN 1 END) as current_entries,
      COALESCE(SUM(CASE WHEN fe.is_last_year THEN fe.hours ELSE 0 END), 0) as last_year_hours
    FROM filtered_entries fe
    GROUP BY fe.loc_name
  )
  -- Return final results
  SELECT 
    cps.loc_name as location_name,
    cps.current_hours as total_hours,
    cps.current_residents as total_residents,
    cps.current_entries as entry_count,
    cps.last_year_hours
  FROM current_period_stats cps
  ORDER BY total_hours DESC;
END;
$function$;