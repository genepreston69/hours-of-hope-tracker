
-- Add the ots_count field to the recovery_surveys table
ALTER TABLE public.recovery_surveys 
ADD COLUMN ots_count INTEGER;
