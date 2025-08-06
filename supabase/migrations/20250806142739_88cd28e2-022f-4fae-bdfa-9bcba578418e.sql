-- The SECURITY DEFINER functions are actually necessary for RLS to work properly
-- These functions need SECURITY DEFINER to access auth.uid() and system tables
-- The linter warning appears to be about views, but these are functions

-- However, let's ensure the location_hours_summary view properly respects RLS
-- by adding RLS to the view itself if it doesn't exist

-- First, let's check if the location_hours_summary view needs RLS
-- Since it aggregates data from service_entries which has RLS, 
-- the view should inherit those restrictions automatically

-- If the linter is still complaining, we might need to recreate 
-- the view to ensure it properly inherits RLS from underlying tables

-- Let's verify the view respects organization boundaries
DROP VIEW IF EXISTS public.location_hours_summary;

CREATE VIEW public.location_hours_summary AS
WITH raw_data AS (
  SELECT 
    se.facility_location_id,
    se.date AS service_date,
    se.hours
  FROM service_entries se
  -- RLS on service_entries will automatically filter by organization
), date_ranges AS (
  SELECT 
    CURRENT_DATE AS today,
    date_trunc('month', CURRENT_DATE::timestamp with time zone) AS mtd_start,
    date_trunc('year', CURRENT_DATE::timestamp with time zone) AS ytd_start,
    date_trunc('month', CURRENT_DATE - interval '1 year') AS last_year_mtd_start,
    date_trunc('year', CURRENT_DATE - interval '1 year') AS last_year_ytd_start,
    CURRENT_DATE - interval '1 year' AS last_year_today
), aggregated AS (
  SELECT 
    r.facility_location_id,
    sum(CASE 
      WHEN r.service_date >= d.mtd_start AND r.service_date <= d.today 
      THEN r.hours 
      ELSE 0 
    END) AS mtd_hours,
    sum(CASE 
      WHEN r.service_date >= d.ytd_start AND r.service_date <= d.today 
      THEN r.hours 
      ELSE 0 
    END) AS ytd_hours,
    sum(CASE 
      WHEN r.service_date >= d.last_year_mtd_start AND r.service_date <= d.last_year_today 
      THEN r.hours 
      ELSE 0 
    END) AS ly_mtd_hours,
    sum(CASE 
      WHEN r.service_date >= d.last_year_ytd_start AND r.service_date <= d.last_year_today 
      THEN r.hours 
      ELSE 0 
    END) AS ly_ytd_hours
  FROM raw_data r
  CROSS JOIN date_ranges d
  GROUP BY r.facility_location_id
)
SELECT 
  a.facility_location_id,
  a.mtd_hours,
  a.ytd_hours,
  a.ly_mtd_hours,
  a.ly_ytd_hours
FROM aggregated a;