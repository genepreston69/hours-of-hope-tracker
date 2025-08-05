-- Add manager review fields to incident_reports table
ALTER TABLE public.incident_reports 
ADD COLUMN resolved boolean DEFAULT NULL,
ADD COLUMN actions_taken_outcome text DEFAULT NULL;

-- Add index for better performance on resolved status queries
CREATE INDEX idx_incident_reports_resolved ON public.incident_reports(resolved) WHERE resolved IS NOT NULL;