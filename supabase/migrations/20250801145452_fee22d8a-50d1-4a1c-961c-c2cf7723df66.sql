-- Update handle_new_user function to work with organizations
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;