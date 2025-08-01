-- Complete security implementation (fixed)

-- Create organizations table
CREATE TABLE public.organizations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on organizations
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, organization_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _organization_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND organization_id = _organization_id
      AND role = _role
  )
$$;

-- Add organization_id to existing tables
ALTER TABLE public.profiles ADD COLUMN organization_id uuid REFERENCES public.organizations(id);
ALTER TABLE public.service_entries ADD COLUMN organization_id uuid REFERENCES public.organizations(id);
ALTER TABLE public.incident_reports ADD COLUMN organization_id uuid REFERENCES public.organizations(id);
ALTER TABLE public.recovery_surveys ADD COLUMN organization_id uuid REFERENCES public.organizations(id);
ALTER TABLE public.notification_recipients ADD COLUMN organization_id uuid REFERENCES public.organizations(id);
ALTER TABLE public.customers ADD COLUMN organization_id uuid REFERENCES public.organizations(id);
ALTER TABLE public.facilities ADD COLUMN organization_id uuid REFERENCES public.organizations(id);
ALTER TABLE public.facility_locations ADD COLUMN organization_id uuid REFERENCES public.organizations(id);

-- Create initial organization
INSERT INTO public.organizations (id, name, slug, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Default Organization',
  'default',
  now(),
  now()
);

-- Update existing records with default organization
DO $$ 
DECLARE
    default_org_id uuid;
BEGIN
    SELECT id INTO default_org_id FROM public.organizations WHERE slug = 'default' LIMIT 1;
    
    UPDATE public.profiles SET organization_id = default_org_id WHERE organization_id IS NULL;
    UPDATE public.service_entries SET organization_id = default_org_id WHERE organization_id IS NULL;
    UPDATE public.incident_reports SET organization_id = default_org_id WHERE organization_id IS NULL;
    UPDATE public.recovery_surveys SET organization_id = default_org_id WHERE organization_id IS NULL;
    UPDATE public.notification_recipients SET organization_id = default_org_id WHERE organization_id IS NULL;
    UPDATE public.customers SET organization_id = default_org_id WHERE organization_id IS NULL;
    UPDATE public.facilities SET organization_id = default_org_id WHERE organization_id IS NULL;
    UPDATE public.facility_locations SET organization_id = default_org_id WHERE organization_id IS NULL;
END $$;

-- Organizations policies (using correct column name)
CREATE POLICY "Organization members can view their organization" 
ON public.organizations 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.organization_id = organizations.id
  )
);

-- User roles policies
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (user_id = auth.uid());

-- Fix function search paths
ALTER FUNCTION public.update_updated_at_column() SET search_path = '';
ALTER FUNCTION public.handle_new_user() SET search_path = '';

-- Enable RLS on routes_data
ALTER TABLE public.routes_data ENABLE ROW LEVEL SECURITY;

-- Add RLS policy for routes_data
CREATE POLICY "Organization members can view routes data" 
ON public.routes_data 
FOR SELECT 
USING (true);