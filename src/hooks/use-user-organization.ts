import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';

export const useUserOrganization = () => {
  const { user } = useAuth();
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserOrganization = async () => {
      if (!user) {
        setOrganizationId(null);
        setLoading(false);
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user organization:', error);
        } else {
          setOrganizationId(profile?.organization_id || null);
        }
      } catch (error) {
        console.error('Error fetching user organization:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrganization();
  }, [user]);

  return { organizationId, loading };
};