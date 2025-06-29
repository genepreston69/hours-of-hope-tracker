
-- Phase 1: Consolidate RLS policies to eliminate redundant evaluations
-- Remove multiple permissive policies and replace with single comprehensive policies

-- CUSTOMERS TABLE CONSOLIDATION
-- Drop any existing policies to start clean
DROP POLICY IF EXISTS "Enable read access for all users" ON public.customers;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.customers;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.customers;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can view customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can create customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can update customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can delete customers" ON public.customers;

-- Create single consolidated policy per action for customers
CREATE POLICY "customers_select_policy" ON public.customers
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "customers_insert_policy" ON public.customers
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "customers_update_policy" ON public.customers
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "customers_delete_policy" ON public.customers
  FOR DELETE TO authenticated
  USING (true);

-- FACILITIES TABLE CONSOLIDATION  
-- Drop any existing policies to start clean
DROP POLICY IF EXISTS "Enable read access for all users" ON public.facilities;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.facilities;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.facilities;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.facilities;
DROP POLICY IF EXISTS "Authenticated users can view facilities" ON public.facilities;
DROP POLICY IF EXISTS "Authenticated users can create facilities" ON public.facilities;
DROP POLICY IF EXISTS "Authenticated users can update facilities" ON public.facilities;
DROP POLICY IF EXISTS "Authenticated users can delete facilities" ON public.facilities;

-- Create single consolidated policy per action for facilities
CREATE POLICY "facilities_select_policy" ON public.facilities
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "facilities_insert_policy" ON public.facilities
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "facilities_update_policy" ON public.facilities
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "facilities_delete_policy" ON public.facilities
  FOR DELETE TO authenticated
  USING (true);

-- FACILITY_LOCATIONS TABLE CONSOLIDATION
-- Drop any existing policies to start clean  
DROP POLICY IF EXISTS "Enable read access for all users" ON public.facility_locations;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.facility_locations;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.facility_locations;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.facility_locations;
DROP POLICY IF EXISTS "Authenticated users can view facility locations" ON public.facility_locations;
DROP POLICY IF EXISTS "Authenticated users can create facility locations" ON public.facility_locations;
DROP POLICY IF EXISTS "Authenticated users can update facility locations" ON public.facility_locations;
DROP POLICY IF EXISTS "Authenticated users can delete facility locations" ON public.facility_locations;

-- Create single consolidated policy per action for facility_locations
CREATE POLICY "facility_locations_select_policy" ON public.facility_locations
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "facility_locations_insert_policy" ON public.facility_locations
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "facility_locations_update_policy" ON public.facility_locations
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "facility_locations_delete_policy" ON public.facility_locations
  FOR DELETE TO authenticated
  USING (true);

-- SERVICE_ENTRIES TABLE CONSOLIDATION
-- Drop any existing policies to start clean
DROP POLICY IF EXISTS "Enable read access for all users" ON public.service_entries;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.service_entries;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.service_entries;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.service_entries;
DROP POLICY IF EXISTS "Authenticated users can view service entries" ON public.service_entries;
DROP POLICY IF EXISTS "Authenticated users can create service entries" ON public.service_entries;
DROP POLICY IF EXISTS "Authenticated users can update service entries" ON public.service_entries;
DROP POLICY IF EXISTS "Authenticated users can delete service entries" ON public.service_entries;

-- Create single consolidated policy per action for service_entries
CREATE POLICY "service_entries_select_policy" ON public.service_entries
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "service_entries_insert_policy" ON public.service_entries
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "service_entries_update_policy" ON public.service_entries
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "service_entries_delete_policy" ON public.service_entries
  FOR DELETE TO authenticated
  USING (true);

-- Enable RLS on all tables (if not already enabled)
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_entries ENABLE ROW LEVEL SECURITY;
