
-- Optimize RLS policies for better performance by using (SELECT auth.uid()) instead of auth.uid()

-- Update profiles table policy
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE
USING ((SELECT auth.uid()) = id);

-- Update recovery_surveys table policies
DROP POLICY IF EXISTS "Authenticated users can create surveys" ON public.recovery_surveys;
DROP POLICY IF EXISTS "Users can update their own surveys" ON public.recovery_surveys;
DROP POLICY IF EXISTS "Users can delete their own surveys" ON public.recovery_surveys;

CREATE POLICY "Authenticated users can create surveys" 
  ON public.recovery_surveys 
  FOR INSERT 
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own surveys" 
  ON public.recovery_surveys 
  FOR UPDATE 
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete their own surveys" 
  ON public.recovery_surveys 
  FOR DELETE 
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- Update incident_reports table policies
DROP POLICY IF EXISTS "Authenticated users can create incident reports" ON public.incident_reports;
DROP POLICY IF EXISTS "Users can update their own incident reports" ON public.incident_reports;
DROP POLICY IF EXISTS "Users can delete their own incident reports" ON public.incident_reports;

CREATE POLICY "Authenticated users can create incident reports" 
  ON public.incident_reports 
  FOR INSERT 
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own incident reports" 
  ON public.incident_reports 
  FOR UPDATE 
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete their own incident reports" 
  ON public.incident_reports 
  FOR DELETE 
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);
