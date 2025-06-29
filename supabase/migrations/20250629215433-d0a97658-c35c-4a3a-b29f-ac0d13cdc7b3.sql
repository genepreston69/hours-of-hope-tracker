
-- Drop the existing restrictive policies for incident reports
DROP POLICY IF EXISTS "Users can view their own incident reports" ON public.incident_reports;
DROP POLICY IF EXISTS "Users can create their own incident reports" ON public.incident_reports;
DROP POLICY IF EXISTS "Users can update their own incident reports" ON public.incident_reports;
DROP POLICY IF EXISTS "Users can delete their own incident reports" ON public.incident_reports;

-- Create new policies that allow all authenticated users to view all incident reports
CREATE POLICY "Authenticated users can view all incident reports" 
  ON public.incident_reports 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create incident reports" 
  ON public.incident_reports 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own incident reports" 
  ON public.incident_reports 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own incident reports" 
  ON public.incident_reports 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);
