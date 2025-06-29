
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Tables } from "@/integrations/supabase/types";

type RecoverySurvey = Tables<'recovery_surveys'>;
type IncidentReport = Tables<'incident_reports'>;

interface UseMyReportsProps {
  reportType: "director" | "incident";
  userId: string;
}

export const useMyReports = ({ reportType, userId }: UseMyReportsProps) => {
  const [reports, setReports] = useState<(RecoverySurvey | IncidentReport)[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      console.log(`Fetching ${reportType} reports for user:`, userId);
      
      if (reportType === "director") {
        const { data, error } = await supabase
          .from('recovery_surveys')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching recovery surveys:', error);
          throw error;
        }
        
        console.log('Recovery surveys fetched:', data?.length || 0);
        setReports(data || []);
      } else {
        const { data, error } = await supabase
          .from('incident_reports')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching incident reports:', error);
          throw error;
        }
        
        console.log('Incident reports fetched:', data?.length || 0);
        setReports(data || []);
      }
    } catch (error) {
      console.error(`Error fetching ${reportType} reports:`, error);
      toast.error(`Failed to load ${reportType} reports`);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async (reportId: string) => {
    if (!confirm("Are you sure you want to delete this report?")) return;

    try {
      console.log(`Deleting ${reportType} report:`, reportId);
      
      const tableName = reportType === "director" ? "recovery_surveys" : "incident_reports";
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', reportId);

      if (error) {
        console.error('Error deleting report:', error);
        throw error;
      }

      console.log(`${reportType} report deleted successfully`);
      toast.success("Report deleted successfully");
      fetchReports();
    } catch (error) {
      console.error("Error deleting report:", error);
      toast.error("Failed to delete report");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchReports();
    } else {
      console.warn('No userId provided to useMyReports');
      setLoading(false);
    }
  }, [reportType, userId]);

  return {
    reports,
    loading,
    fetchReports,
    deleteReport
  };
};
