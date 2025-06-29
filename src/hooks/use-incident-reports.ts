
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "@/components/ui/sonner";

type IncidentReport = Tables<'incident_reports'>;

export const useIncidentReports = () => {
  const [incidentReports, setIncidentReports] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchIncidentReports = async () => {
    if (!user) {
      setIncidentReports([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('incident_reports')
        .select('*')
        .order('incident_date', { ascending: false });

      if (error) {
        console.error('Error fetching incident reports:', error);
        toast.error('Failed to fetch incident reports');
        return;
      }

      setIncidentReports(data || []);
    } catch (error) {
      console.error('Error fetching incident reports:', error);
      toast.error('Failed to fetch incident reports');
    } finally {
      setLoading(false);
    }
  };

  const deleteIncidentReport = async (reportId: string) => {
    try {
      const { error } = await supabase
        .from('incident_reports')
        .delete()
        .eq('id', reportId);

      if (error) {
        console.error('Error deleting incident report:', error);
        toast.error('Failed to delete incident report');
        return;
      }

      toast.success('Incident report deleted successfully');
      await fetchIncidentReports(); // Refresh the list
    } catch (error) {
      console.error('Error deleting incident report:', error);
      toast.error('Failed to delete incident report');
    }
  };

  useEffect(() => {
    fetchIncidentReports();
  }, [user]);

  return {
    incidentReports,
    loading,
    fetchIncidentReports,
    deleteIncidentReport
  };
};
