
-- FINAL COMPREHENSIVE FIX: Remove ALL duplicate policies and fix auth pattern
-- This addresses all 15 remaining warnings in one migration

-- Step 1: Drop ALL old policies that are causing duplicates
-- Customers table cleanup
DROP POLICY IF EXISTS "Allow authenticated users to insert customers" ON public.customers;
DROP POLICY IF EXISTS "Allow public write access" ON public.customers;
DROP POLICY IF EXISTS "Allow public update access" ON public.customers;

-- Facilities table cleanup  
DROP POLICY IF EXISTS "Allow authenticated users to insert facilities" ON public.facilities;
DROP POLICY IF EXISTS "Allow public write access" ON public.facilities;
DROP POLICY IF EXISTS "Allow public update access" ON public.facilities;
DROP POLICY IF EXISTS "Allow public delete access" ON public.facilities;

-- Facility locations table cleanup
DROP POLICY IF EXISTS "Allow authenticated users to insert facility locations" ON public.facility_locations;
DROP POLICY IF EXISTS "Allow public write access" ON public.facility_locations;
DROP POLICY IF EXISTS "Allow public update access" ON public.facility_locations;
DROP POLICY IF EXISTS "Allow public delete access" ON public.facility_locations;

-- Service entries table cleanup
DROP POLICY IF EXISTS "Allow authenticated users to insert service entries" ON public.service_entries;
DROP POLICY IF EXISTS "Allow public write access" ON public.service_entries;
DROP POLICY IF EXISTS "Allow public update access" ON public.service_entries;
DROP POLICY IF EXISTS "Allow public delete access" ON public.service_entries;

-- Profiles table cleanup - fix the auth pattern issue
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Step 2: Fix redundant SELECT policies for user-specific tables
-- For incident_reports: combine into single policy
DROP POLICY IF EXISTS "incident_reports_select_policy" ON public.incident_reports;
DROP POLICY IF EXISTS "incident_reports_modify_policy" ON public.incident_reports;

-- For recovery_surveys: combine into single policy  
DROP POLICY IF EXISTS "recovery_surveys_select_policy" ON public.recovery_surveys;
DROP POLICY IF EXISTS "recovery_surveys_modify_policy" ON public.recovery_surveys;

-- Step 3: Create optimized single policies
-- User-specific tables with proper auth pattern
CREATE POLICY "incident_reports_policy" ON public.incident_reports
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "recovery_surveys_policy" ON public.recovery_surveys
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- Profiles with correct auth pattern
CREATE POLICY "profiles_policy_fixed" ON public.profiles
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

-- Step 4: Verification query
SELECT 
  tablename,
  COUNT(*) as policy_count,
  array_agg(policyname ORDER BY policyname) as policies
FROM pg_policies 
WHERE schemaname = 'public' 
GROUP BY tablename
ORDER BY tablename;
