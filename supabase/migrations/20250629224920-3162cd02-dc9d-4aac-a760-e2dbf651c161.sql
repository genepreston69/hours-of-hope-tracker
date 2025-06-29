
-- Update incident_reports policy to allow all authenticated users to view all reports
-- This is needed for the Reports page to show all incident reports
DROP POLICY IF EXISTS "incident_reports_policy" ON public.incident_reports;

-- Create separate policies for incident_reports
CREATE POLICY "Authenticated users can view all incident reports" 
  ON public.incident_reports 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Users can create incident reports" 
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
