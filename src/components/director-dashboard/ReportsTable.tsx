
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye } from "lucide-react";
import { ReportDetailsDialog } from "./ReportDetailsDialog";
import { Tables } from "@/integrations/supabase/types";

type RecoverySurvey = Tables<'recovery_surveys'>;

interface ReportsTableProps {
  surveys: RecoverySurvey[];
}

export const ReportsTable = ({ surveys }: ReportsTableProps) => {
  const [selectedSurvey, setSelectedSurvey] = useState<RecoverySurvey | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleViewReport = (survey: RecoverySurvey) => {
    setSelectedSurvey(survey);
    setDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recent Director Reports</CardTitle>
          <CardDescription>All submitted director reports with option to view details</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Date</TableHead>
                <TableHead>Program Name</TableHead>
                <TableHead>Reporter</TableHead>
                <TableHead>Phase 1</TableHead>
                <TableHead>Phase 2</TableHead>
                <TableHead>Total Intakes</TableHead>
                <TableHead>Discharges</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {surveys.map((survey) => (
                <TableRow key={survey.id}>
                  <TableCell>{survey.report_date ? new Date(survey.report_date).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>{survey.program_name || 'N/A'}</TableCell>
                  <TableCell>{survey.reporter_name || 'N/A'}</TableCell>
                  <TableCell>{survey.phase1_count || 0}</TableCell>
                  <TableCell>{survey.phase2_count || 0}</TableCell>
                  <TableCell>{survey.total_intakes || 0}</TableCell>
                  <TableCell>{survey.discharges || 0}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewReport(survey)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ReportDetailsDialog
        selectedSurvey={selectedSurvey}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
};
