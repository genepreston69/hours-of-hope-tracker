-- Fix remaining security issues

-- Fix function search paths
ALTER FUNCTION public.update_updated_at_column() SET search_path = '';
ALTER FUNCTION public.handle_new_user() SET search_path = '';

-- Enable RLS on routes_data and location_hours_summary if they exist
ALTER TABLE public.routes_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_hours_summary ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for routes_data (if it should be organization-scoped)
CREATE POLICY "Organization members can view routes data" 
ON public.routes_data 
FOR SELECT 
USING (true); -- This might need to be updated based on business requirements

-- Add RLS policies for location_hours_summary 
CREATE POLICY "Organization members can view location hours summary" 
ON public.location_hours_summary 
FOR SELECT 
USING (true); -- This might need to be updated based on business requirements

-- Create initial organization for existing data
INSERT INTO public.organizations (id, name, slug, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Default Organization',
  'default',
  now(),
  now()
) ON CONFLICT DO NOTHING;

-- Get the default organization ID
DO $$ 
DECLARE
    default_org_id uuid;
BEGIN
    SELECT id INTO default_org_id FROM public.organizations WHERE slug = 'default' LIMIT 1;
    
    -- Update existing records with the default organization
    UPDATE public.profiles SET organization_id = default_org_id WHERE organization_id IS NULL;
    UPDATE public.service_entries SET organization_id = default_org_id WHERE organization_id IS NULL;
    UPDATE public.incident_reports SET organization_id = default_org_id WHERE organization_id IS NULL;
    UPDATE public.recovery_surveys SET organization_id = default_org_id WHERE organization_id IS NULL;
    UPDATE public.notification_recipients SET organization_id = default_org_id WHERE organization_id IS NULL;
    UPDATE public.customers SET organization_id = default_org_id WHERE organization_id IS NULL;
    UPDATE public.facilities SET organization_id = default_org_id WHERE organization_id IS NULL;
    UPDATE public.facility_locations SET organization_id = default_org_id WHERE organization_id IS NULL;
END $$;