
-- CRITICAL FIX: Complete policy cleanup and optimization
-- This addresses the escalated performance issues where policies accumulated instead of being replaced

-- PHASE 1: Complete cleanup of ALL redundant policies on customers table
DROP POLICY IF EXISTS "Allow authenticated users to view all customers" ON public.customers;
DROP POLICY IF EXISTS "Allow public read access" ON public.customers;
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
DROP POLICY IF EXISTS "customers_authenticated_access" ON public.customers;

-- Create ONE optimized policy for customers
CREATE POLICY "customers_optimized" ON public.customers
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- PHASE 2: Complete cleanup of ALL redundant policies on facilities table
DROP POLICY IF EXISTS "Allow authenticated users to view all facilities" ON public.facilities;
DROP POLICY IF EXISTS "Allow public read access" ON public.facilities;
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
DROP POLICY IF EXISTS "facilities_authenticated_access" ON public.facilities;

-- Create ONE optimized policy for facilities
CREATE POLICY "facilities_optimized" ON public.facilities
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- PHASE 3: Complete cleanup of ALL redundant policies on facility_locations table
DROP POLICY IF EXISTS "Allow authenticated users to view all facility locations" ON public.facility_locations;
DROP POLICY IF EXISTS "Allow public read access" ON public.facility_locations;
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
DROP POLICY IF EXISTS "facility_locations_authenticated_access" ON public.facility_locations;

-- Create ONE optimized policy for facility_locations
CREATE POLICY "facility_locations_optimized" ON public.facility_locations
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- PHASE 4: Complete cleanup of ALL redundant policies on service_entries table
DROP POLICY IF EXISTS "Allow authenticated users to view all service entries" ON public.service_entries;
DROP POLICY IF EXISTS "Allow public read access" ON public.service_entries;
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
DROP POLICY IF EXISTS "service_entries_authenticated_access" ON public.service_entries;

-- Create ONE optimized policy for service_entries
CREATE POLICY "service_entries_optimized" ON public.service_entries
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- PHASE 5: Fix user-specific tables with proper auth pattern
-- Clean up recovery_surveys policies
DROP POLICY IF EXISTS "Users can view their own surveys" ON public.recovery_surveys;
DROP POLICY IF EXISTS "Users can create their own surveys" ON public.recovery_surveys;
DROP POLICY IF EXISTS "Users can update their own surveys" ON public.recovery_surveys;
DROP POLICY IF EXISTS "Users can delete their own surveys" ON public.recovery_surveys;
DROP POLICY IF EXISTS "Authenticated users can view all surveys" ON public.recovery_surveys;
DROP POLICY IF EXISTS "Authenticated users can create surveys" ON public.recovery_surveys;
DROP POLICY IF EXISTS "recovery_surveys_view_all" ON public.recovery_surveys;
DROP POLICY IF EXISTS "recovery_surveys_user_access" ON public.recovery_surveys;
DROP POLICY IF EXISTS "recovery_surveys_update_own" ON public.recovery_surveys;
DROP POLICY IF EXISTS "recovery_surveys_delete_own" ON public.recovery_surveys;

-- Create optimized policies for recovery_surveys with CORRECT auth pattern
CREATE POLICY "recovery_surveys_select" ON public.recovery_surveys
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "recovery_surveys_modify" ON public.recovery_surveys
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- Clean up incident_reports policies  
DROP POLICY IF EXISTS "Users can view their own incident reports" ON public.incident_reports;
DROP POLICY IF EXISTS "Users can create their own incident reports" ON public.incident_reports;
DROP POLICY IF EXISTS "Users can update their own incident reports" ON public.incident_reports;
DROP POLICY IF EXISTS "Users can delete their own incident reports" ON public.incident_reports;
DROP POLICY IF EXISTS "Authenticated users can view all incident reports" ON public.incident_reports;
DROP POLICY IF EXISTS "Authenticated users can create incident reports" ON public.incident_reports;
DROP POLICY IF EXISTS "incident_reports_view_all" ON public.incident_reports;
DROP POLICY IF EXISTS "incident_reports_user_access" ON public.incident_reports;
DROP POLICY IF EXISTS "incident_reports_update_own" ON public.incident_reports;
DROP POLICY IF EXISTS "incident_reports_delete_own" ON public.incident_reports;

-- Create optimized policies for incident_reports with CORRECT auth pattern
CREATE POLICY "incident_reports_select" ON public.incident_reports
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "incident_reports_modify" ON public.incident_reports
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- Clean up profiles policies
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_user_access" ON public.profiles;

-- Create optimized policy for profiles with CORRECT auth pattern
CREATE POLICY "profiles_optimized" ON public.profiles
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

-- Verification: Add comments to track optimization
COMMENT ON POLICY "customers_optimized" ON public.customers IS 
'PERFORMANCE OPTIMIZED: Single policy replaces multiple redundant policies';

COMMENT ON POLICY "recovery_surveys_modify" ON public.recovery_surveys IS 
'PERFORMANCE OPTIMIZED: Uses (SELECT auth.uid()) for O(1) evaluation instead of O(n)';

-- Final check: Ensure all tables have RLS enabled
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recovery_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
