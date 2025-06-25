
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Edit, Eye, Trash2 } from "lucide-react";
import { ReportStatusBadge } from "./ReportStatusBadge";
import { Tables } from "@/integrations/supabase/types";

type RecoverySurvey = Tables<'recovery_surveys'>;
type IncidentReport = Tables<'incident_reports'>;

interface ReportRowProps {
  report: RecoverySurvey | IncidentReport;
  reportType: "director" | "incident";
  onEdit: (report: RecoverySurvey | IncidentReport) => void;
  onDelete: (reportId: string) => void;
}

export const ReportRow = ({ report, reportType, onEdit, onDelete }: ReportRowProps) => {
  const getReportStatus = (report: RecoverySurvey | IncidentReport) => {
    if (reportType === "incident" && 'submitted_at' in report) {
      return report.submitted_at ? 'submitted' : 'draft';
    }
    if (reportType === "director" && 'report_date' in report) {
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

  const status = getReportStatus(report);
  const isDraft = status === 'draft';

  return (
    <TableRow>
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
              onClick={() => onEdit(report)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(report)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          )}
          {isDraft && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(report.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};
