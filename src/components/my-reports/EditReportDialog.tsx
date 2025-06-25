
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type RecoverySurvey = Tables<'recovery_surveys'>;
type IncidentReport = Tables<'incident_reports'>;

interface EditReportDialogProps {
  report: RecoverySurvey | IncidentReport | null;
  reportType: "director" | "incident";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReportUpdated: () => void;
}

export const EditReportDialog = ({ 
  report, 
  reportType, 
  open, 
  onOpenChange,
  onReportUpdated 
}: EditReportDialogProps) => {
  if (!report) return null;

  const getReportStatus = (report: RecoverySurvey | IncidentReport) => {
    if ('report_status' in report) {
      return report.report_status || 'draft';
    }
    return report.submitted_at ? 'submitted' : 'draft';
  };

  const isDraft = getReportStatus(report) === 'draft';

  const handleEditInForm = () => {
    // Store the report ID in localStorage so the form can load it
    localStorage.setItem(`edit_${reportType}_report`, report.id);
    
    // Navigate to the appropriate form
    const path = reportType === "director" ? "/recovery-survey" : "/incident-report";
    window.location.href = path;
  };

  const getReportTitle = () => {
    if ('program_name' in report) {
      return report.program_name || 'Director Report';
    }
    return `${report.incident_type || 'Incident'} - ${report.location || 'Unknown Location'}`;
  };

  const getReportDate = () => {
    if ('report_date' in report) {
      return report.report_date ? new Date(report.report_date).toLocaleDateString() : 'N/A';
    }
    return report.incident_date ? new Date(report.incident_date).toLocaleDateString() : 'N/A';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{getReportTitle()}</DialogTitle>
          <DialogDescription>
            Report Date: {getReportDate()} | Status: {getReportStatus(report)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Created:</strong> {new Date(report.created_at || '').toLocaleDateString()}
            </div>
            <div>
              <strong>Last Updated:</strong> {new Date(report.updated_at || '').toLocaleDateString()}
            </div>
          </div>

          {reportType === "director" && 'program_name' in report && (
            <div className="space-y-2">
              <h4 className="font-semibold">Report Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>Phase 1 Count: {report.phase1_count || 0}</div>
                <div>Phase 2 Count: {report.phase2_count || 0}</div>
                <div>Total Intakes: {report.total_intakes || 0}</div>
                <div>Discharges: {report.discharges || 0}</div>
              </div>
              {report.week_summary && (
                <div>
                  <strong>Week Summary:</strong> 
                  <p className="mt-1 text-gray-600">{report.week_summary}</p>
                </div>
              )}
            </div>
          )}

          {reportType === "incident" && (
            <div className="space-y-2">
              <h4 className="font-semibold">Incident Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>Type: {report.incident_type}</div>
                <div>Severity: {report.severity_level}</div>
                <div>Location: {report.location}</div>
                <div>Time: {report.incident_time}</div>
              </div>
              {report.incident_description && (
                <div>
                  <strong>Description:</strong>
                  <p className="mt-1 text-gray-600">{report.incident_description}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {isDraft && (
              <Button onClick={handleEditInForm}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Edit in Form
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
