-- Add the view to RLS so it can be accessed
ALTER VIEW public.location_hours_summary ENABLE ROW LEVEL SECURITY;
CREATE POLICY "location_hours_summary_policy" ON public.location_hours_summary
  FOR ALL USING (true);