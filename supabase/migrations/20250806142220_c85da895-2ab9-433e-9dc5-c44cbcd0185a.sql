-- Fix organizations table RLS policy performance issue
DROP POLICY IF EXISTS "Organization members can view their organization" ON public.organizations;
CREATE POLICY "Organization members can view their organization" ON public.organizations
FOR SELECT USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = (SELECT auth.uid()) 
    AND profiles.organization_id = organizations.id
  )
);