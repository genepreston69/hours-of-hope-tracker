
-- Remove the old profiles_policy that's causing the duplicate warnings
DROP POLICY IF EXISTS "profiles_policy" ON public.profiles;

-- Verification: This should show only one policy per table
SELECT 
  tablename,
  COUNT(*) as policy_count,
  array_agg(policyname ORDER BY policyname) as policies
FROM pg_policies 
WHERE schemaname = 'public' 
GROUP BY tablename
ORDER BY tablename;
