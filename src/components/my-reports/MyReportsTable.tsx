
import { useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { ReportsTableHeader } from "./ReportsTableHeader";
import { ReportRow } from "./ReportRow";
import { EmptyReportsState } from "./EmptyReportsState";
import { EditReportDialog } from "./EditReportDialog";
import { useMyReports } from "./useMyReports";
import { Tables } from "@/integrations/supabase/types";

type RecoverySurvey = Tables<'recovery_surveys'>;
type IncidentReport = Tables<'incident_reports'>;

interface MyReportsTableProps {
  reportType: "director" | "incident";
  userId: string;
}

export const MyReportsTable = ({ reportType, userId }: MyReportsTableProps) => {
  const { reports, loading, fetchReports, deleteReport } = useMyReports({ reportType, userId });
  const [selectedReport, setSelectedReport] = useState<RecoverySurvey | IncidentReport | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleEdit = (report: RecoverySurvey | IncidentReport) => {
    setSelectedReport(report);
    setEditDialogOpen(true);
  };

  if (loading) {
    return <div className="text-center py-4">Loading reports...</div>;
  }

  if (reports.length === 0) {
    return <EmptyReportsState reportType={reportType} />;
  }

  return (
    <>
      <Table>
        <ReportsTableHeader />
        <TableBody>
          {reports.map((report) => (
            <ReportRow
              key={report.id}
              report={report}
              reportType={reportType}
              onEdit={handleEdit}
              onDelete={deleteReport}
            />
          ))}
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
