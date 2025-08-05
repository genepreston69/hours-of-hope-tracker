
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
      console.log("useIncidentReports: Fetching submitted incident reports only - refetch triggered");
      
      const { data, error, count } = await supabase
        .from('incident_reports')
        .select('*', { count: 'exact' })
        .eq('report_status', 'submitted')
        .order('incident_date', { ascending: false });

      console.log("useIncidentReports: Query completed for submitted reports only");
      console.log("useIncidentReports: Error:", error);
      console.log("useIncidentReports: Data count:", data?.length);
      console.log("useIncidentReports: Total count:", count);
      
      if (data && data.length > 0) {
        console.log("useIncidentReports: Sample report resolved status:", data[0].resolved);
        console.log("useIncidentReports: Sample report actions_taken_outcome:", data[0].actions_taken_outcome);
      }

      if (error) {
        console.error('useIncidentReports: Error fetching incident reports:', error);
        console.error('useIncidentReports: Error details:', JSON.stringify(error, null, 2));
        toast.error('Failed to fetch incident reports: ' + error.message);
        setIncidentReports([]);
        return;
      }

      console.log("useIncidentReports: Successfully fetched", data?.length || 0, "submitted incident reports");
      if (data && data.length > 0) {
        console.log("useIncidentReports: Sample report structure:", Object.keys(data[0]));
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

      console.log("useIncidentReports: Report deleted successfully");
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
      console.log("useIncidentReports: Initializing fetch for submitted reports only");
      fetchIncidentReports();
    } else if (!user) {
      // Reset when user logs out
      hasInitialized.current = false;
      setIncidentReports([]);
      setLoading(false);
    }
  }, [user, fetchIncidentReports]);

  return {
    incidentReports,
    loading,
    fetchIncidentReports,
    deleteIncidentReport
  };
};
