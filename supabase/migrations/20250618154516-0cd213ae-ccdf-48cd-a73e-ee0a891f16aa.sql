
-- Drop the existing restrictive policies
DROP POLICY IF EXISTS "Users can view their own surveys" ON public.recovery_surveys;
DROP POLICY IF EXISTS "Users can create their own surveys" ON public.recovery_surveys;
DROP POLICY IF EXISTS "Users can update their own surveys" ON public.recovery_surveys;
DROP POLICY IF EXISTS "Users can delete their own surveys" ON public.recovery_surveys;

-- Create new policies that allow all authenticated users to view all surveys
CREATE POLICY "Authenticated users can view all surveys" 
  ON public.recovery_surveys 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create surveys" 
  ON public.recovery_surveys 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own surveys" 
  ON public.recovery_surveys 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own surveys" 
  ON public.recovery_surveys 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);
