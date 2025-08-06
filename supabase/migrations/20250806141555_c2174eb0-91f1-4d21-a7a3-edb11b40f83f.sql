-- Fix security vulnerabilities in database functions by properly setting search_path

-- Update get_current_user_organization function
CREATE OR REPLACE FUNCTION public.get_current_user_organization()
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN (
    SELECT organization_id 
    FROM public.profiles 
    WHERE id = auth.uid()
  );
END;
$function$;

-- Update has_role function (text version)
CREATE OR REPLACE FUNCTION public.has_role(required_role text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.profiles p ON ur.user_id = p.id
    WHERE p.id = auth.uid() AND ur.role = required_role::public.app_role
  );
END;
$function$;

-- Update has_role function (app_role version) 
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _organization_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND organization_id = _organization_id
      AND role = _role
  )
$function$;

-- Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  default_org_id uuid;
BEGIN
  -- Get the default organization
  SELECT id INTO default_org_id FROM public.organizations WHERE slug = 'default' LIMIT 1;
  
  -- Insert profile with organization
  INSERT INTO public.profiles (id, username, organization_id)
  VALUES (new.id, new.email, default_org_id);
  
  -- Add default user role
  INSERT INTO public.user_roles (user_id, organization_id, role)
  VALUES (new.id, default_org_id, 'user');
  
  RETURN new;
END;
$function$;