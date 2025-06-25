
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
      
      if (reportType === "director") {
        const { data, error } = await supabase
          .from('recovery_surveys')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setReports(data || []);
      } else {
        const { data, error } = await supabase
          .from('incident_reports')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setReports(data || []);
      }
    } catch (error) {
      console.error(`Error fetching ${reportType} reports:`, error);
      toast.error(`Failed to load ${reportType} reports`);
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async (reportId: string) => {
    if (!confirm("Are you sure you want to delete this report?")) return;

    try {
      const tableName = reportType === "director" ? "recovery_surveys" : "incident_reports";
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', reportId);

      if (error) throw error;

      toast.success("Report deleted successfully");
      fetchReports();
    } catch (error) {
      console.error("Error deleting report:", error);
      toast.error("Failed to delete report");
    }
  };

  useEffect(() => {
    fetchReports();
  }, [reportType, userId]);

  return {
    reports,
    loading,
    fetchReports,
    deleteReport
  };
};
