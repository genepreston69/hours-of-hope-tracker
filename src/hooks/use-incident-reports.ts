
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "@/components/ui/sonner";

type IncidentReport = Tables<'incident_reports'>;

export const useIncidentReports = () => {
  const [incidentReports, setIncidentReports] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const hasInitialized = useRef(false);

  const fetchIncidentReports = useCallback(async () => {
    if (!user) {
      console.log("useIncidentReports: No user, setting empty reports");
      setIncidentReports([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log("useIncidentReports: Fetching all incident reports");
      
      const { data, error, count } = await supabase
        .from('incident_reports')
        .select('*', { count: 'exact' })
        .order('incident_date', { ascending: false });

      console.log("useIncidentReports: Query completed");
      console.log("useIncidentReports: Error:", error);
      console.log("useIncidentReports: Data:", data);
      console.log("useIncidentReports: Count:", count);

      if (error) {
        console.error('useIncidentReports: Error fetching incident reports:', error);
        console.error('useIncidentReports: Error details:', JSON.stringify(error, null, 2));
        toast.error('Failed to fetch incident reports: ' + error.message);
        setIncidentReports([]);
        return;
      }

      console.log("useIncidentReports: Fetched", data?.length || 0, "incident reports");
      if (data && data.length > 0) {
        console.log("useIncidentReports: Sample report:", data[0]);
      }
      setIncidentReports(data || []);
    } catch (error) {
      console.error('useIncidentReports: Catch block - Error fetching incident reports:', error);
      toast.error('Failed to fetch incident reports');
      setIncidentReports([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const deleteIncidentReport = useCallback(async (reportId: string) => {
    try {
      console.log("useIncidentReports: Attempting to delete report:", reportId);
      
      const { error } = await supabase
        .from('incident_reports')
        .delete()
        .eq('id', reportId);

      if (error) {
        console.error('useIncidentReports: Error deleting incident report:', error);
        toast.error('Failed to delete incident report: ' + error.message);
        return;
      }

      toast.success('Incident report deleted successfully');
      await fetchIncidentReports(); // Refresh the list
    } catch (error) {
      console.error('useIncidentReports: Catch block - Error deleting incident report:', error);
      toast.error('Failed to delete incident report');
    }
  }, [fetchIncidentReports]);

  // Only fetch once when user is available and component hasn't initialized
  useEffect(() => {
    if (user && !hasInitialized.current) {
      hasInitialized.current = true;
      console.log("useIncidentReports: Initializing fetch for authenticated user");
      fetchIncidentReports();
    }
  }, [user, fetchIncidentReports]);

  return {
    incidentReports,
    loading,
    fetchIncidentReports,
    deleteIncidentReport
  };
};
