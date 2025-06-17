
-- Create incident_reports table for comprehensive incident tracking
CREATE TABLE public.incident_reports (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  
  -- Basic incident details
  incident_date date NOT NULL,
  incident_time time NOT NULL,
  location text NOT NULL,
  incident_type text NOT NULL,
  severity_level text NOT NULL,
  
  -- Incident description
  incident_description text NOT NULL,
  immediate_cause text,
  contributing_factors text,
  
  -- People involved
  residents_involved jsonb DEFAULT '[]'::jsonb,
  staff_involved jsonb DEFAULT '[]'::jsonb,
  visitors_involved jsonb DEFAULT '[]'::jsonb,
  witnesses jsonb DEFAULT '[]'::jsonb,
  
  -- Medical information
  injuries_sustained text,
  medical_treatment_provided boolean DEFAULT false,
  medical_professional_contacted boolean DEFAULT false,
  medical_professional_details text,
  hospital_transport_required boolean DEFAULT false,
  hospital_details text,
  
  -- Immediate response
  immediate_actions_taken text,
  supervisor_notified boolean DEFAULT false,
  supervisor_name text,
  supervisor_notification_time timestamp with time zone,
  family_notified boolean DEFAULT false,
  family_notification_details text,
  
  -- Regulatory and follow-up
  regulatory_reporting_required boolean DEFAULT false,
  regulatory_agencies text,
  follow_up_actions_required text,
  incident_prevention_measures text,
  
  -- Documentation
  photos_taken boolean DEFAULT false,
  evidence_collected boolean DEFAULT false,
  additional_documentation text,
  
  -- Status and tracking
  report_status text DEFAULT 'draft',
  submitted_at timestamp with time zone,
  reviewed_by text,
  reviewed_at timestamp with time zone,
  
  -- Auto-save functionality
  last_saved_at timestamp with time zone DEFAULT now(),
  auto_save_data jsonb DEFAULT '{}'::jsonb,
  
  -- Audit trail
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for incident reports
CREATE POLICY "Users can view their own incident reports" 
  ON public.incident_reports 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own incident reports" 
  ON public.incident_reports 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own incident reports" 
  ON public.incident_reports 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own incident reports" 
  ON public.incident_reports 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_incident_reports_user_id ON public.incident_reports(user_id);
CREATE INDEX idx_incident_reports_incident_date ON public.incident_reports(incident_date);
CREATE INDEX idx_incident_reports_status ON public.incident_reports(report_status);
CREATE INDEX idx_incident_reports_type ON public.incident_reports(incident_type);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_incident_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_incident_reports_updated_at
  BEFORE UPDATE ON public.incident_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_incident_reports_updated_at();
