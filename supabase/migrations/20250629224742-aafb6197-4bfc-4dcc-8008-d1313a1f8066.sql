
-- Update recovery_surveys policy to allow all authenticated users to view all surveys
-- This is needed for the Director Dashboard to show all recovery surveys
DROP POLICY IF EXISTS "recovery_surveys_policy" ON public.recovery_surveys;

-- Create separate policies for recovery_surveys
CREATE POLICY "Authenticated users can view all recovery surveys" 
  ON public.recovery_surveys 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Users can create recovery surveys" 
  ON public.recovery_surveys 
  FOR INSERT 
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own recovery surveys" 
  ON public.recovery_surveys 
  FOR UPDATE 
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete their own recovery surveys" 
  ON public.recovery_surveys 
  FOR DELETE 
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);
