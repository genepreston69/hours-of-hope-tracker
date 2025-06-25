
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Eye, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { ReportStatusBadge } from "./ReportStatusBadge";
import { EditReportDialog } from "./EditReportDialog";
import { Tables } from "@/integrations/supabase/types";

type RecoverySurvey = Tables<'recovery_surveys'>;
type IncidentReport = Tables<'incident_reports'>;

interface MyReportsTableProps {
  reportType: "director" | "incident";
  userId: string;
}

export const MyReportsTable = ({ reportType, userId }: MyReportsTableProps) => {
  const [reports, setReports] = useState<(RecoverySurvey | IncidentReport)[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<RecoverySurvey | IncidentReport | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [reportType, userId]);

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

  const handleEdit = (report: RecoverySurvey | IncidentReport) => {
    setSelectedReport(report);
    setEditDialogOpen(true);
  };

  const handleDelete = async (reportId: string) => {
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

  const getReportStatus = (report: RecoverySurvey | IncidentReport) => {
    if (reportType === "incident" && 'submitted_at' in report) {
      return report.submitted_at ? 'submitted' : 'draft';
    }
    if (reportType === "director" && 'report_date' in report) {
      // For director reports, we'll consider them submitted if they have a report_date
      return report.report_date ? 'submitted' : 'draft';
    }
    return 'draft';
  };

  const getReportDate = (report: RecoverySurvey | IncidentReport) => {
    if (reportType === "director" && 'report_date' in report) {
      return report.report_date ? new Date(report.report_date).toLocaleDateString() : 'N/A';
    }
    if (reportType === "incident" && 'incident_date' in report) {
      return report.incident_date ? new Date(report.incident_date).toLocaleDateString() : 'N/A';
    }
    return 'N/A';
  };

  const getReportTitle = (report: RecoverySurvey | IncidentReport) => {
    if (reportType === "director" && 'program_name' in report) {
      return report.program_name || 'Director Report';
    }
    if (reportType === "incident" && 'incident_type' in report) {
      return `${report.incident_type || 'Incident'} - ${report.location || 'Unknown Location'}`;
    }
    return 'Report';
  };

  if (loading) {
    return <div className="text-center py-4">Loading reports...</div>;
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No {reportType} reports found.</p>
        <p className="text-sm mt-2">
          {reportType === "director" 
            ? "Create your first director report to get started."
            : "Create your first incident report to get started."
          }
        </p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Report</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => {
            const status = getReportStatus(report);
            const isDraft = status === 'draft';
            
            return (
              <TableRow key={report.id}>
                <TableCell className="font-medium">
                  {getReportTitle(report)}
                </TableCell>
                <TableCell>{getReportDate(report)}</TableCell>
                <TableCell>
                  <ReportStatusBadge status={status} />
                </TableCell>
                <TableCell>
                  {new Date(report.created_at || '').toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {isDraft ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(report)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(report)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    )}
                    {isDraft && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(report.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <EditReportDialog
        report={selectedReport}
        reportType={reportType}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onReportUpdated={fetchReports}
      />
    </>
  );
};
