
-- Security fix: Set explicit search path for the handle_new_user function to prevent hijacking
ALTER FUNCTION public.handle_new_user() 
SET search_path = public, pg_catalog;
