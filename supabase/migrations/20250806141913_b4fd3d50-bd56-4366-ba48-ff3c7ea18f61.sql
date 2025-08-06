-- Fix RLS policy performance issues by wrapping auth functions in subqueries

-- Fix profiles table policy
DROP POLICY IF EXISTS "profiles_policy_fixed" ON public.profiles;
CREATE POLICY "profiles_policy_fixed" ON public.profiles
FOR ALL USING ((SELECT auth.uid()) = id)
WITH CHECK ((SELECT auth.uid()) = id);

-- Fix incident_reports table policies
DROP POLICY IF EXISTS "Users can create incident reports" ON public.incident_reports;
CREATE POLICY "Users can create incident reports" ON public.incident_reports
FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own incident reports" ON public.incident_reports;
CREATE POLICY "Users can update their own incident reports" ON public.incident_reports
FOR UPDATE USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own incident reports" ON public.incident_reports;
CREATE POLICY "Users can delete their own incident reports" ON public.incident_reports
FOR DELETE USING ((SELECT auth.uid()) = user_id);

-- Fix recovery_surveys table policies
DROP POLICY IF EXISTS "Users can create recovery surveys" ON public.recovery_surveys;
CREATE POLICY "Users can create recovery surveys" ON public.recovery_surveys
FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own recovery surveys" ON public.recovery_surveys;
CREATE POLICY "Users can update their own recovery surveys" ON public.recovery_surveys
FOR UPDATE USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own recovery surveys" ON public.recovery_surveys;
CREATE POLICY "Users can delete their own recovery surveys" ON public.recovery_surveys
FOR DELETE USING ((SELECT auth.uid()) = user_id);

-- Fix user_roles table policy
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT USING (user_id = (SELECT auth.uid()));

-- Fix grievances table policies
DROP POLICY IF EXISTS "Users can view their own grievances" ON public.grievances;
CREATE POLICY "Users can view their own grievances" ON public.grievances
FOR SELECT USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create their own grievances" ON public.grievances;
CREATE POLICY "Users can create their own grievances" ON public.grievances
FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own grievances" ON public.grievances;
CREATE POLICY "Users can update their own grievances" ON public.grievances
FOR UPDATE USING ((SELECT auth.uid()) = user_id);

-- Fix innovations table policies
DROP POLICY IF EXISTS "Users can view their own innovations" ON public.innovations;
CREATE POLICY "Users can view their own innovations" ON public.innovations
FOR SELECT USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create their own innovations" ON public.innovations;
CREATE POLICY "Users can create their own innovations" ON public.innovations
FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own innovations" ON public.innovations;
CREATE POLICY "Users can update their own innovations" ON public.innovations
FOR UPDATE USING ((SELECT auth.uid()) = user_id);

-- Fix resident_emails table policies
DROP POLICY IF EXISTS "Users can view their own emails" ON public.resident_emails;
CREATE POLICY "Users can view their own emails" ON public.resident_emails
FOR SELECT USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create their own emails" ON public.resident_emails;
CREATE POLICY "Users can create their own emails" ON public.resident_emails
FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);