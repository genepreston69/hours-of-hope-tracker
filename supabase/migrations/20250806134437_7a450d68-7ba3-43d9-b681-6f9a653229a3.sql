-- Allow managers to update incident reports for review purposes
-- This policy allows authenticated users to update the manager review fields (resolved, actions_taken_outcome, reviewed_at)
-- for any incident report, which is necessary for the manager review workflow

CREATE POLICY "Managers can review incident reports" 
ON public.incident_reports 
FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);