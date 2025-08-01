-- Phase 1: Critical RLS Policy Overhaul and Organization Structure

-- First, create organizations table for proper tenant isolation
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on organizations
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Add organization_id to profiles table
ALTER TABLE public.profiles ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL;

-- Add organization_id to other relevant tables for proper scoping
ALTER TABLE public.service_entries ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.incident_reports ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.recovery_surveys ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.notification_recipients ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

-- Add user role enum and user_roles table for proper authorization
CREATE TYPE public.app_role AS ENUM ('super_admin', 'org_admin', 'manager', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, organization_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer functions to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.get_user_organization_id(user_uuid UUID)
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT organization_id FROM public.profiles WHERE id = user_uuid;
$$;

CREATE OR REPLACE FUNCTION public.user_has_role(user_uuid UUID, org_uuid UUID, check_role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = user_uuid 
    AND (organization_id = org_uuid OR check_role = 'super_admin')
    AND role = check_role
  );
$$;

CREATE OR REPLACE FUNCTION public.user_can_access_org(user_uuid UUID, org_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    LEFT JOIN public.user_roles ur ON ur.user_id = p.id
    WHERE p.id = user_uuid 
    AND (p.organization_id = org_uuid OR ur.role = 'super_admin')
  );
$$;

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "customers_policy" ON public.customers;
DROP POLICY IF EXISTS "facilities_policy" ON public.facilities;
DROP POLICY IF EXISTS "facility_locations_policy" ON public.facility_locations;
DROP POLICY IF EXISTS "service_entries_policy" ON public.service_entries;
DROP POLICY IF EXISTS "profiles_policy_fixed" ON public.profiles;

-- Create secure RLS policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Create secure RLS policies for organizations
CREATE POLICY "Users can view their organization"
ON public.organizations FOR SELECT
USING (public.user_can_access_org(auth.uid(), id));

CREATE POLICY "Organization admins can update their organization"
ON public.organizations FOR UPDATE
USING (public.user_has_role(auth.uid(), id, 'org_admin') OR public.user_has_role(auth.uid(), id, 'super_admin'));

CREATE POLICY "Super admins can insert organizations"
ON public.organizations FOR INSERT
WITH CHECK (public.user_has_role(auth.uid(), id, 'super_admin'));

-- Create secure RLS policies for user_roles
CREATE POLICY "Users can view roles in their organization"
ON public.user_roles FOR SELECT
USING (public.user_can_access_org(auth.uid(), organization_id) OR user_id = auth.uid());

CREATE POLICY "Organization admins can manage roles"
ON public.user_roles FOR ALL
USING (public.user_has_role(auth.uid(), organization_id, 'org_admin') OR public.user_has_role(auth.uid(), organization_id, 'super_admin'));

-- Create secure RLS policies for service_entries
CREATE POLICY "Users can view service entries in their organization"
ON public.service_entries FOR SELECT
USING (public.user_can_access_org(auth.uid(), organization_id));

CREATE POLICY "Users can create service entries in their organization"
ON public.service_entries FOR INSERT
WITH CHECK (public.user_can_access_org(auth.uid(), organization_id));

CREATE POLICY "Users can update service entries in their organization"
ON public.service_entries FOR UPDATE
USING (public.user_can_access_org(auth.uid(), organization_id));

CREATE POLICY "Organization admins can delete service entries"
ON public.service_entries FOR DELETE
USING (public.user_has_role(auth.uid(), organization_id, 'org_admin') OR public.user_has_role(auth.uid(), organization_id, 'super_admin'));

-- Create secure RLS policies for incident_reports (users can only manage their own reports)
CREATE POLICY "Users can view incident reports in their organization"
ON public.incident_reports FOR SELECT
USING (public.user_can_access_org(auth.uid(), organization_id));

CREATE POLICY "Users can create their own incident reports"
ON public.incident_reports FOR INSERT
WITH CHECK (auth.uid() = user_id AND public.user_can_access_org(auth.uid(), organization_id));

CREATE POLICY "Users can update their own incident reports"
ON public.incident_reports FOR UPDATE
USING (auth.uid() = user_id AND public.user_can_access_org(auth.uid(), organization_id));

CREATE POLICY "Users can delete their own incident reports"
ON public.incident_reports FOR DELETE
USING (auth.uid() = user_id AND public.user_can_access_org(auth.uid(), organization_id));

-- Create secure RLS policies for recovery_surveys (users can only manage their own surveys)
CREATE POLICY "Users can view recovery surveys in their organization"
ON public.recovery_surveys FOR SELECT
USING (public.user_can_access_org(auth.uid(), organization_id));

CREATE POLICY "Users can create their own recovery surveys"
ON public.recovery_surveys FOR INSERT
WITH CHECK (auth.uid() = user_id AND public.user_can_access_org(auth.uid(), organization_id));

CREATE POLICY "Users can update their own recovery surveys"
ON public.recovery_surveys FOR UPDATE
USING (auth.uid() = user_id AND public.user_can_access_org(auth.uid(), organization_id));

CREATE POLICY "Users can delete their own recovery surveys"
ON public.recovery_surveys FOR DELETE
USING (auth.uid() = user_id AND public.user_can_access_org(auth.uid(), organization_id));

-- Create secure RLS policies for notification_recipients (admin only)
CREATE POLICY "Organization admins can manage notification recipients"
ON public.notification_recipients FOR ALL
USING (public.user_has_role(auth.uid(), organization_id, 'org_admin') OR public.user_has_role(auth.uid(), organization_id, 'super_admin'));

-- Create secure RLS policies for customers (organization scoped)
ALTER TABLE public.customers ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

CREATE POLICY "Users can view customers in their organization"
ON public.customers FOR SELECT
USING (public.user_can_access_org(auth.uid(), organization_id));

CREATE POLICY "Users can manage customers in their organization"
ON public.customers FOR ALL
USING (public.user_can_access_org(auth.uid(), organization_id))
WITH CHECK (public.user_can_access_org(auth.uid(), organization_id));

-- Create secure RLS policies for facilities (organization scoped)
ALTER TABLE public.facilities ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

CREATE POLICY "Users can view facilities in their organization"
ON public.facilities FOR SELECT
USING (public.user_can_access_org(auth.uid(), organization_id));

CREATE POLICY "Organization admins can manage facilities"
ON public.facilities FOR ALL
USING (public.user_has_role(auth.uid(), organization_id, 'org_admin') OR public.user_has_role(auth.uid(), organization_id, 'super_admin'))
WITH CHECK (public.user_has_role(auth.uid(), organization_id, 'org_admin') OR public.user_has_role(auth.uid(), organization_id, 'super_admin'));

-- Create secure RLS policies for facility_locations (organization scoped)
ALTER TABLE public.facility_locations ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

CREATE POLICY "Users can view facility locations in their organization"
ON public.facility_locations FOR SELECT
USING (public.user_can_access_org(auth.uid(), organization_id));

CREATE POLICY "Organization admins can manage facility locations"
ON public.facility_locations FOR ALL
USING (public.user_has_role(auth.uid(), organization_id, 'org_admin') OR public.user_has_role(auth.uid(), organization_id, 'super_admin'))
WITH CHECK (public.user_has_role(auth.uid(), organization_id, 'org_admin') OR public.user_has_role(auth.uid(), organization_id, 'super_admin'));

-- Fix database functions with proper security
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_catalog'
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Update handle_new_user function to be more secure
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_catalog'
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$;

-- Add triggers for updated_at columns
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Make user_id columns NOT NULL where they should be
ALTER TABLE public.incident_reports ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.recovery_surveys ALTER COLUMN user_id SET NOT NULL;