
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { Tables } from "@/integrations/supabase/types";
import { Eye } from "lucide-react";

type IncidentReport = Tables<'incident_reports'>;

interface IncidentReportsTableProps {
  incidentReports: IncidentReport[];
  deleteIncidentReport?: (id: string) => void;
}

export const IncidentReportsTable = ({ incidentReports, deleteIncidentReport }: IncidentReportsTableProps) => {
  console.log("IncidentReportsTable: Rendering with", incidentReports.length, "submitted reports");
  if (incidentReports.length > 0) {
    console.log("IncidentReportsTable: Sample report data:", incidentReports[0]);
  }

  return (
    <Card className="bg-white/80 backdrop-blur-xl border border-slate-200/60">
      <CardHeader>
        <CardTitle className="text-slate-900">Submitted Incident Reports</CardTitle>
        <CardDescription className="text-slate-600">
          Showing {incidentReports.length} submitted incident reports
        </CardDescription>
      </CardHeader>
      <CardContent>
        {incidentReports.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No submitted incident reports found.</p>
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidentReports.map((report: IncidentReport) => (
                  <TableRow key={report.id}>
                    <TableCell>{formatDate(new Date(report.incident_date))}</TableCell>
                    <TableCell className="font-medium">{report.location}</TableCell>
                    <TableCell>{report.incident_type}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.severity_level === 'Critical' ? 'bg-red-100 text-red-800' :
                        report.severity_level === 'High' ? 'bg-orange-100 text-orange-800' :
                        report.severity_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {report.severity_level}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Submitted
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Incident Report Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold text-sm text-gray-600">Date</h4>
                                  <p>{formatDate(new Date(report.incident_date))}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-sm text-gray-600">Time</h4>
                                  <p>{report.incident_time}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-sm text-gray-600">Location</h4>
                                  <p>{report.location}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-sm text-gray-600">Type</h4>
                                  <p>{report.incident_type}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-sm text-gray-600">Severity</h4>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    report.severity_level === 'Critical' ? 'bg-red-100 text-red-800' :
                                    report.severity_level === 'High' ? 'bg-orange-100 text-orange-800' :
                                    report.severity_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {report.severity_level}
                                  </span>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-sm text-gray-600">Status</h4>
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Submitted
                                  </span>
                                </div>
                              </div>
                              
                              {report.incident_description && (
                                <div>
                                  <h4 className="font-semibold text-sm text-gray-600 mb-2">Description</h4>
                                  <p className="text-sm bg-gray-50 p-3 rounded">{report.incident_description}</p>
                                </div>
                              )}
                              
                              {report.immediate_cause && (
                                <div>
                                  <h4 className="font-semibold text-sm text-gray-600 mb-2">Immediate Cause</h4>
                                  <p className="text-sm bg-gray-50 p-3 rounded">{report.immediate_cause}</p>
                                </div>
                              )}
                              
                              {report.immediate_actions_taken && (
                                <div>
                                  <h4 className="font-semibold text-sm text-gray-600 mb-2">Immediate Actions Taken</h4>
                                  <p className="text-sm bg-gray-50 p-3 rounded">{report.immediate_actions_taken}</p>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        {deleteIncidentReport && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">Delete</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete this incident report. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteIncidentReport(report.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
