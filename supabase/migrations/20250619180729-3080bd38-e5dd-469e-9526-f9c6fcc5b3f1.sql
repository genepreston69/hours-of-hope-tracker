
-- Add education and life skills columns to the recovery_surveys table
ALTER TABLE public.recovery_surveys 
ADD COLUMN ged_preparation_starts integer DEFAULT 0,
ADD COLUMN ged_completions integer DEFAULT 0,
ADD COLUMN life_skills_starts integer DEFAULT 0,
ADD COLUMN drivers_license_received integer DEFAULT 0;
