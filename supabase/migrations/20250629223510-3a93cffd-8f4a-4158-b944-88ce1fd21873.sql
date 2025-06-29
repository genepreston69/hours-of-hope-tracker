
-- DEFINITIVE FIX: Complete policy cleanup and proper optimization
-- This will remove ALL existing policies and create clean, optimized ones

-- Step 1: Remove ALL policies from customers table
DROP POLICY IF EXISTS "Allow authenticated users to view all customers" ON public.customers;
DROP POLICY IF EXISTS "Allow authenticated users to create customers" ON public.customers;
DROP POLICY IF EXISTS "Allow authenticated users to update customers" ON public.customers;
DROP POLICY IF EXISTS "Allow authenticated users to delete customers" ON public.customers;
DROP POLICY IF EXISTS "Allow public read access" ON public.customers;
DROP POLICY IF EXISTS "Allow public delete access" ON public.customers;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.customers;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.customers;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.customers;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.customers;
DROP POLICY IF EXISTS "customers_select_policy" ON public.customers;
DROP POLICY IF EXISTS "customers_insert_policy" ON public.customers;
DROP POLICY IF EXISTS "customers_update_policy" ON public.customers;
DROP POLICY IF EXISTS "customers_delete_policy" ON public.customers;
DROP POLICY IF EXISTS "customers_authenticated_access" ON public.customers;
DROP POLICY IF EXISTS "customers_optimized" ON public.customers;

-- Step 2: Remove ALL policies from facilities table
DROP POLICY IF EXISTS "Allow authenticated users to view all facilities" ON public.facilities;
DROP POLICY IF EXISTS "Allow authenticated users to create facilities" ON public.facilities;
DROP POLICY IF EXISTS "Allow authenticated users to update facilities" ON public.facilities;
DROP POLICY IF EXISTS "Allow authenticated users to delete facilities" ON public.facilities;
DROP POLICY IF EXISTS "Allow public read access" ON public.facilities;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.facilities;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.facilities;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.facilities;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.facilities;
DROP POLICY IF EXISTS "facilities_select_policy" ON public.facilities;
DROP POLICY IF EXISTS "facilities_insert_policy" ON public.facilities;
DROP POLICY IF EXISTS "facilities_update_policy" ON public.facilities;
DROP POLICY IF EXISTS "facilities_delete_policy" ON public.facilities;
DROP POLICY IF EXISTS "facilities_authenticated_access" ON public.facilities;
DROP POLICY IF EXISTS "facilities_optimized" ON public.facilities;

-- Step 3: Remove ALL policies from facility_locations table
DROP POLICY IF EXISTS "Allow authenticated users to view all facility locations" ON public.facility_locations;
DROP POLICY IF EXISTS "Allow authenticated users to create facility locations" ON public.facility_locations;
DROP POLICY IF EXISTS "Allow authenticated users to update facility locations" ON public.facility_locations;
DROP POLICY IF EXISTS "Allow authenticated users to delete facility locations" ON public.facility_locations;
DROP POLICY IF EXISTS "Allow public read access" ON public.facility_locations;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.facility_locations;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.facility_locations;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.facility_locations;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.facility_locations;
DROP POLICY IF EXISTS "facility_locations_select_policy" ON public.facility_locations;
DROP POLICY IF EXISTS "facility_locations_insert_policy" ON public.facility_locations;
DROP POLICY IF EXISTS "facility_locations_update_policy" ON public.facility_locations;
DROP POLICY IF EXISTS "facility_locations_delete_policy" ON public.facility_locations;
DROP POLICY IF EXISTS "facility_locations_authenticated_access" ON public.facility_locations;
DROP POLICY IF EXISTS "facility_locations_optimized" ON public.facility_locations;

-- Step 4: Remove ALL policies from service_entries table
DROP POLICY IF EXISTS "Allow authenticated users to view all service entries" ON public.service_entries;
DROP POLICY IF EXISTS "Allow authenticated users to create service entries" ON public.service_entries;
DROP POLICY IF EXISTS "Allow authenticated users to update service entries" ON public.service_entries;
DROP POLICY IF EXISTS "Allow authenticated users to delete service entries" ON public.service_entries;
DROP POLICY IF EXISTS "Allow public read access" ON public.service_entries;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.service_entries;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.service_entries;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.service_entries;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.service_entries;
DROP POLICY IF EXISTS "service_entries_select_policy" ON public.service_entries;
DROP POLICY IF EXISTS "service_entries_insert_policy" ON public.service_entries;
DROP POLICY IF EXISTS "service_entries_update_policy" ON public.service_entries;
DROP POLICY IF EXISTS "service_entries_delete_policy" ON public.service_entries;
DROP POLICY IF EXISTS "service_entries_authenticated_access" ON public.service_entries;
DROP POLICY IF EXISTS "service_entries_optimized" ON public.service_entries;

-- Step 5: Remove ALL policies from recovery_surveys table
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
DROP POLICY IF EXISTS "recovery_surveys_select" ON public.recovery_surveys;
DROP POLICY IF EXISTS "recovery_surveys_modify" ON public.recovery_surveys;

-- Step 6: Remove ALL policies from incident_reports table
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
DROP POLICY IF EXISTS "incident_reports_select" ON public.incident_reports;
DROP POLICY IF EXISTS "incident_reports_modify" ON public.incident_reports;

-- Step 7: Remove ALL policies from profiles table
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_user_access" ON public.profiles;
DROP POLICY IF EXISTS "profiles_optimized" ON public.profiles;

-- Step 8: Create ONE optimized policy per table (shared access tables)
CREATE POLICY "customers_policy" ON public.customers
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "facilities_policy" ON public.facilities
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "facility_locations_policy" ON public.facility_locations
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "service_entries_policy" ON public.service_entries
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Step 9: Create optimized policies for user-specific tables (CORRECT auth pattern)
CREATE POLICY "recovery_surveys_select_policy" ON public.recovery_surveys
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "recovery_surveys_modify_policy" ON public.recovery_surveys
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "incident_reports_select_policy" ON public.incident_reports
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "incident_reports_modify_policy" ON public.incident_reports
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "profiles_policy" ON public.profiles
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

-- Step 10: Ensure RLS is enabled
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recovery_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 11: Verification query to confirm cleanup worked
-- This should return exactly 7 rows (1 per table for shared, 2 for user-specific)
SELECT 
  tablename,
  COUNT(*) as policy_count,
  array_agg(policyname) as policy_names
FROM pg_policies 
WHERE schemaname = 'public' 
GROUP BY tablename
ORDER BY tablename;
