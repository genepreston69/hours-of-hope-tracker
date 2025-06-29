
-- Performance Optimization: Consolidate and optimize RLS policies
-- This addresses the critical performance issues identified in the analysis

-- PHASE 1: Drop all redundant and inefficient policies
-- CUSTOMERS TABLE CLEANUP
DROP POLICY IF EXISTS "Enable read access for all users" ON public.customers;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.customers;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.customers;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can view customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can create customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can update customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can delete customers" ON public.customers;
DROP POLICY IF EXISTS "customers_select_policy" ON public.customers;
DROP POLICY IF EXISTS "customers_insert_policy" ON public.customers;
DROP POLICY IF EXISTS "customers_update_policy" ON public.customers;
DROP POLICY IF EXISTS "customers_delete_policy" ON public.customers;

-- Create single optimized policy for customers
CREATE POLICY "customers_authenticated_access" ON public.customers
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- FACILITIES TABLE CLEANUP
DROP POLICY IF EXISTS "Enable read access for all users" ON public.facilities;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.facilities;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.facilities;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.facilities;
DROP POLICY IF EXISTS "Authenticated users can view facilities" ON public.facilities;
DROP POLICY IF EXISTS "Authenticated users can create facilities" ON public.facilities;
DROP POLICY IF EXISTS "Authenticated users can update facilities" ON public.facilities;
DROP POLICY IF EXISTS "Authenticated users can delete facilities" ON public.facilities;
DROP POLICY IF EXISTS "facilities_select_policy" ON public.facilities;
DROP POLICY IF EXISTS "facilities_insert_policy" ON public.facilities;
DROP POLICY IF EXISTS "facilities_update_policy" ON public.facilities;
DROP POLICY IF EXISTS "facilities_delete_policy" ON public.facilities;

-- Create single optimized policy for facilities
CREATE POLICY "facilities_authenticated_access" ON public.facilities
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- FACILITY_LOCATIONS TABLE CLEANUP
DROP POLICY IF EXISTS "Enable read access for all users" ON public.facility_locations;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.facility_locations;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.facility_locations;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.facility_locations;
DROP POLICY IF EXISTS "Authenticated users can view facility locations" ON public.facility_locations;
DROP POLICY IF EXISTS "Authenticated users can create facility locations" ON public.facility_locations;
DROP POLICY IF EXISTS "Authenticated users can update facility locations" ON public.facility_locations;
DROP POLICY IF EXISTS "Authenticated users can delete facility locations" ON public.facility_locations;
DROP POLICY IF EXISTS "facility_locations_select_policy" ON public.facility_locations;
DROP POLICY IF EXISTS "facility_locations_insert_policy" ON public.facility_locations;
DROP POLICY IF EXISTS "facility_locations_update_policy" ON public.facility_locations;
DROP POLICY IF EXISTS "facility_locations_delete_policy" ON public.facility_locations;

-- Create single optimized policy for facility_locations
CREATE POLICY "facility_locations_authenticated_access" ON public.facility_locations
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- SERVICE_ENTRIES TABLE CLEANUP
DROP POLICY IF EXISTS "Enable read access for all users" ON public.service_entries;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.service_entries;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.service_entries;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.service_entries;
DROP POLICY IF EXISTS "Authenticated users can view service entries" ON public.service_entries;
DROP POLICY IF EXISTS "Authenticated users can create service entries" ON public.service_entries;
DROP POLICY IF EXISTS "Authenticated users can update service entries" ON public.service_entries;
DROP POLICY IF EXISTS "Authenticated users can delete service entries" ON public.service_entries;
DROP POLICY IF EXISTS "service_entries_select_policy" ON public.service_entries;
DROP POLICY IF EXISTS "service_entries_insert_policy" ON public.service_entries;
DROP POLICY IF EXISTS "service_entries_update_policy" ON public.service_entries;
DROP POLICY IF EXISTS "service_entries_delete_policy" ON public.service_entries;

-- Create single optimized policy for service_entries
CREATE POLICY "service_entries_authenticated_access" ON public.service_entries
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- PHASE 2: Optimize user-specific policies with subquery pattern
-- Update recovery_surveys policies to use optimized auth pattern
DROP POLICY IF EXISTS "Authenticated users can view all surveys" ON public.recovery_surveys;
DROP POLICY IF EXISTS "Authenticated users can create surveys" ON public.recovery_surveys;
DROP POLICY IF EXISTS "Users can update their own surveys" ON public.recovery_surveys;
DROP POLICY IF EXISTS "Users can delete their own surveys" ON public.recovery_surveys;

-- Create optimized policies for recovery_surveys (user-specific access)
CREATE POLICY "recovery_surveys_view_all" ON public.recovery_surveys
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "recovery_surveys_user_access" ON public.recovery_surveys
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "recovery_surveys_update_own" ON public.recovery_surveys
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "recovery_surveys_delete_own" ON public.recovery_surveys
  FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- Update incident_reports policies to use optimized auth pattern
DROP POLICY IF EXISTS "Authenticated users can view all incident reports" ON public.incident_reports;
DROP POLICY IF EXISTS "Authenticated users can create incident reports" ON public.incident_reports;
DROP POLICY IF EXISTS "Users can update their own incident reports" ON public.incident_reports;
DROP POLICY IF EXISTS "Users can delete their own incident reports" ON public.incident_reports;

-- Create optimized policies for incident_reports (user-specific access)
CREATE POLICY "incident_reports_view_all" ON public.incident_reports
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "incident_reports_user_access" ON public.incident_reports
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "incident_reports_update_own" ON public.incident_reports
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "incident_reports_delete_own" ON public.incident_reports
  FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- Update profiles policy to use optimized auth pattern
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "profiles_user_access" ON public.profiles
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

-- PHASE 3: Add performance indexes for RLS policy columns
-- These indexes will significantly speed up RLS policy evaluation
CREATE INDEX IF NOT EXISTS idx_recovery_surveys_user_id ON public.recovery_surveys(user_id);
CREATE INDEX IF NOT EXISTS idx_incident_reports_user_id ON public.incident_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);

-- Add comment explaining the optimization
COMMENT ON POLICY "customers_authenticated_access" ON public.customers IS 
'Optimized single policy for all operations - eliminates redundant policy evaluation';

COMMENT ON POLICY "recovery_surveys_user_access" ON public.recovery_surveys IS 
'Uses (SELECT auth.uid()) pattern for O(1) auth function evaluation instead of O(n)';
