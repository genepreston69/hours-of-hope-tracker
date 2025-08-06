-- Fix multiple permissive policies by combining them with OR conditions

-- Fix incident_reports table - combine two UPDATE policies
DROP POLICY IF EXISTS "Users can update their own incident reports" ON public.incident_reports;
DROP POLICY IF EXISTS "Managers and admins can review incident reports" ON public.incident_reports;
CREATE POLICY "Users and managers can update incident reports" ON public.incident_reports
FOR UPDATE USING (
  ((SELECT auth.uid()) = user_id) OR 
  (has_role('admin'::text) OR has_role('manager'::text))
)
WITH CHECK (
  ((SELECT auth.uid()) = user_id) OR 
  (has_role('admin'::text) OR has_role('manager'::text))
);

-- Fix grievances table - combine multiple SELECT and UPDATE policies
DROP POLICY IF EXISTS "Staff can view all grievances" ON public.grievances;
DROP POLICY IF EXISTS "Users can view their own grievances" ON public.grievances;
CREATE POLICY "Users and staff can view grievances" ON public.grievances
FOR SELECT USING (
  ((SELECT auth.uid()) = user_id) OR 
  (has_role('admin'::text) OR has_role('manager'::text))
);

DROP POLICY IF EXISTS "Staff can update all grievances" ON public.grievances;
DROP POLICY IF EXISTS "Users can update their own grievances" ON public.grievances;
CREATE POLICY "Users and staff can update grievances" ON public.grievances
FOR UPDATE USING (
  ((SELECT auth.uid()) = user_id) OR 
  (has_role('admin'::text) OR has_role('manager'::text))
);

-- Fix innovations table - combine multiple SELECT and UPDATE policies
DROP POLICY IF EXISTS "Staff can view all innovations" ON public.innovations;
DROP POLICY IF EXISTS "Users can view their own innovations" ON public.innovations;
CREATE POLICY "Users and staff can view innovations" ON public.innovations
FOR SELECT USING (
  ((SELECT auth.uid()) = user_id) OR 
  (has_role('admin'::text) OR has_role('manager'::text))
);

DROP POLICY IF EXISTS "Staff can update all innovations" ON public.innovations;
DROP POLICY IF EXISTS "Users can update their own innovations" ON public.innovations;
CREATE POLICY "Users and staff can update innovations" ON public.innovations
FOR UPDATE USING (
  ((SELECT auth.uid()) = user_id) OR 
  (has_role('admin'::text) OR has_role('manager'::text))
);

-- Fix resident_emails table - combine multiple SELECT policies
DROP POLICY IF EXISTS "Staff can view all emails" ON public.resident_emails;
DROP POLICY IF EXISTS "Users can view their own emails" ON public.resident_emails;
CREATE POLICY "Users and staff can view emails" ON public.resident_emails
FOR SELECT USING (
  ((SELECT auth.uid()) = user_id) OR 
  (has_role('admin'::text) OR has_role('manager'::text))
);

-- Fix notification_recipients table - remove redundant SELECT policy since ALL already covers it
DROP POLICY IF EXISTS "Authenticated users can view all recipients" ON public.notification_recipients;