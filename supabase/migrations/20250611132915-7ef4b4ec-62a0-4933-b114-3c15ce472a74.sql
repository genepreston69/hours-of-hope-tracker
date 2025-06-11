
-- Create a table for recovery survey responses
CREATE TABLE public.recovery_surveys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  
  -- Report Details
  program_name TEXT NOT NULL,
  report_date DATE NOT NULL,
  reporter_name TEXT NOT NULL,
  
  -- Program Highlights
  week_summary TEXT,
  events TEXT,
  upcoming_events TEXT,
  accomplishments TEXT,
  
  -- Staffing
  staff_meetings INTEGER,
  meeting_dates TEXT,
  evaluations TEXT,
  evaluation_details TEXT,
  staffing_needs TEXT,
  
  -- Resident Data
  phase1_count INTEGER,
  phase2_count INTEGER,
  phase1_completions INTEGER,
  phase1_next_steps TEXT,
  phase2_completions INTEGER,
  phase2_next_steps TEXT,
  peer_mentors INTEGER,
  mat_clients INTEGER,
  total_intakes INTEGER,
  mat_intakes INTEGER,
  court_intakes INTEGER,
  scheduled_intakes INTEGER,
  ots1_orientations INTEGER,
  discharges INTEGER,
  discharge_reasons TEXT,
  drug_screens INTEGER,
  
  -- Facility
  facility_issues TEXT,
  supply_needs TEXT,
  program_concerns TEXT,
  
  -- Additional
  celebrations TEXT,
  additional_comments TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own surveys
ALTER TABLE public.recovery_surveys ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own surveys
CREATE POLICY "Users can view their own recovery surveys" 
  ON public.recovery_surveys 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own surveys
CREATE POLICY "Users can create their own recovery surveys" 
  ON public.recovery_surveys 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own surveys
CREATE POLICY "Users can update their own recovery surveys" 
  ON public.recovery_surveys 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own surveys
CREATE POLICY "Users can delete their own recovery surveys" 
  ON public.recovery_surveys 
  FOR DELETE 
  USING (auth.uid() = user_id);
