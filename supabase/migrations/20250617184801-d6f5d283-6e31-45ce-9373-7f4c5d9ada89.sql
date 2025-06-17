
-- RLS Performance Optimization: Update profiles table policy to evaluate auth.uid() once per query instead of per row
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE
USING ((SELECT auth.uid()) = id);
