-- Create helper function to get current user's organization ID
CREATE OR REPLACE FUNCTION get_current_user_organization()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT organization_id 
    FROM profiles 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update existing security functions with proper search_path
CREATE OR REPLACE FUNCTION has_role(required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN profiles p ON ur.user_id = p.id
    WHERE p.id = auth.uid() AND ur.role = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Drop existing overly permissive RLS policies
DROP POLICY IF EXISTS "Users can view all customers" ON customers;
DROP POLICY IF EXISTS "Users can insert customers" ON customers;
DROP POLICY IF EXISTS "Users can update customers" ON customers;
DROP POLICY IF EXISTS "Users can delete customers" ON customers;

DROP POLICY IF EXISTS "Users can view all facilities" ON facilities;
DROP POLICY IF EXISTS "Users can insert facilities" ON facilities;
DROP POLICY IF EXISTS "Users can update facilities" ON facilities;
DROP POLICY IF EXISTS "Users can delete facilities" ON facilities;

DROP POLICY IF EXISTS "Users can view all facility_locations" ON facility_locations;
DROP POLICY IF EXISTS "Users can insert facility_locations" ON facility_locations;
DROP POLICY IF EXISTS "Users can update facility_locations" ON facility_locations;
DROP POLICY IF EXISTS "Users can delete facility_locations" ON facility_locations;

DROP POLICY IF EXISTS "Users can view all service_entries" ON service_entries;
DROP POLICY IF EXISTS "Users can insert service_entries" ON service_entries;
DROP POLICY IF EXISTS "Users can update service_entries" ON service_entries;
DROP POLICY IF EXISTS "Users can delete service_entries" ON service_entries;

-- Create secure organization-based RLS policies for customers
CREATE POLICY "Users can view customers in their organization" 
ON customers FOR SELECT 
USING (organization_id = get_current_user_organization());

CREATE POLICY "Users can insert customers in their organization" 
ON customers FOR INSERT 
WITH CHECK (organization_id = get_current_user_organization());

CREATE POLICY "Users can update customers in their organization" 
ON customers FOR UPDATE 
USING (organization_id = get_current_user_organization());

CREATE POLICY "Users can delete customers in their organization" 
ON customers FOR DELETE 
USING (organization_id = get_current_user_organization());

-- Create secure organization-based RLS policies for facilities
CREATE POLICY "Users can view facilities in their organization" 
ON facilities FOR SELECT 
USING (organization_id = get_current_user_organization());

CREATE POLICY "Users can insert facilities in their organization" 
ON facilities FOR INSERT 
WITH CHECK (organization_id = get_current_user_organization());

CREATE POLICY "Users can update facilities in their organization" 
ON facilities FOR UPDATE 
USING (organization_id = get_current_user_organization());

CREATE POLICY "Users can delete facilities in their organization" 
ON facilities FOR DELETE 
USING (organization_id = get_current_user_organization());

-- Create secure organization-based RLS policies for facility_locations
CREATE POLICY "Users can view facility_locations in their organization" 
ON facility_locations FOR SELECT 
USING (organization_id = get_current_user_organization());

CREATE POLICY "Users can insert facility_locations in their organization" 
ON facility_locations FOR INSERT 
WITH CHECK (organization_id = get_current_user_organization());

CREATE POLICY "Users can update facility_locations in their organization" 
ON facility_locations FOR UPDATE 
USING (organization_id = get_current_user_organization());

CREATE POLICY "Users can delete facility_locations in their organization" 
ON facility_locations FOR DELETE 
USING (organization_id = get_current_user_organization());

-- Create secure organization-based RLS policies for service_entries
CREATE POLICY "Users can view service_entries in their organization" 
ON service_entries FOR SELECT 
USING (organization_id = get_current_user_organization());

CREATE POLICY "Users can insert service_entries in their organization" 
ON service_entries FOR INSERT 
WITH CHECK (organization_id = get_current_user_organization());

CREATE POLICY "Users can update service_entries in their organization" 
ON service_entries FOR UPDATE 
USING (organization_id = get_current_user_organization());

CREATE POLICY "Users can delete service_entries in their organization" 
ON service_entries FOR DELETE 
USING (organization_id = get_current_user_organization());