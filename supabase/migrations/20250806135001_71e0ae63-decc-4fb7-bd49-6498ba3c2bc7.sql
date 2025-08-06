-- Security Fix Phase 1: Critical RLS Policy Fixes

-- Remove overly permissive policies that allow all operations
DROP POLICY IF EXISTS "customers_policy" ON public.customers;
DROP POLICY IF EXISTS "facilities_policy" ON public.facilities;
DROP POLICY IF EXISTS "facility_locations_policy" ON public.facility_locations;
DROP POLICY IF EXISTS "service_entries_policy" ON public.service_entries;

-- Replace the overly permissive incident reports manager review policy
DROP POLICY IF EXISTS "Managers can review incident reports" ON public.incident_reports;

-- Create proper role-based policy for incident report management
CREATE POLICY "Managers and admins can review incident reports" 
ON public.incident_reports 
FOR UPDATE 
TO authenticated 
USING (has_role('admin') OR has_role('manager'))
WITH CHECK (has_role('admin') OR has_role('manager'));

-- Fix database functions to use proper search_path settings
CREATE OR REPLACE FUNCTION public.get_current_user_organization()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN (
    SELECT organization_id 
    FROM profiles 
    WHERE id = auth.uid()
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.has_role(required_role text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN profiles p ON ur.user_id = p.id
    WHERE p.id = auth.uid() AND ur.role = required_role
  );
END;
$function$;