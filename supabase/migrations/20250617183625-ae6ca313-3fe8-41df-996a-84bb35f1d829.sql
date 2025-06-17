
-- Security fix: Set explicit search path for the function to prevent hijacking
ALTER FUNCTION public.update_incident_reports_updated_at() 
SET search_path = public, pg_catalog;
