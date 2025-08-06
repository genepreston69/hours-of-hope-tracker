
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { Tables } from "@/integrations/supabase/types";
import { Eye, Settings, Archive } from "lucide-react";
import { ManagerReviewDialog } from "@/components/incident-reports/ManagerReviewDialog";
import { useState } from "react";

type IncidentReport = Tables<'incident_reports'>;

interface IncidentReportsTableProps {
  incidentReports: IncidentReport[];
  deleteIncidentReport?: (id: string) => void;
  onReportUpdate?: () => void;
}

export const IncidentReportsTable = ({ incidentReports, deleteIncidentReport, onReportUpdate }: IncidentReportsTableProps) => {
  const [selectedReport, setSelectedReport] = useState<IncidentReport | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  
  console.log("IncidentReportsTable: Rendering with", incidentReports.length, "submitted reports");
  if (incidentReports.length > 0) {
    console.log("IncidentReportsTable: Sample report data:", incidentReports[0]);
  }

  const handleManagerReview = (report: IncidentReport) => {
    setSelectedReport(report);
    setReviewDialogOpen(true);
  };

  const handleArchive = (report: IncidentReport) => {
    // TODO: Implement archive functionality
    console.log("Archive report:", report.id);
  };

  const handleReviewComplete = () => {
    console.log("IncidentReportsTable: handleReviewComplete called, calling onReportUpdate");
    onReportUpdate?.();
  };

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
                      {report.resolved === null ? (
                        <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                          Pending
                        </span>
                      ) : report.resolved ? (
                        <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                          Resolved
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                          Not Resolved
                        </span>
                      )}
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
                              <DialogTitle>Incident Report Details - {formatDate(new Date(report.incident_date))}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              {/* Basic Information */}
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
                              
                              {/* Incident Description */}
                              {report.incident_description && (
                                <div>
                                  <h4 className="font-semibold text-sm text-gray-600 mb-2">Incident Description</h4>
                                  <p className="text-sm bg-gray-50 p-3 rounded">{report.incident_description}</p>
                                </div>
                              )}
                              
                              {/* People Involved */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Residents */}
                                {report.residents_involved && Array.isArray(report.residents_involved) && report.residents_involved.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold text-sm text-gray-600 mb-2">Residents Involved</h4>
                                    <div className="space-y-2">
                                      {(report.residents_involved as any[]).map((resident: any, index: number) => (
                                        <div key={index} className="text-sm bg-blue-50 p-2 rounded">
                                          <p><strong>Name:</strong> {resident.name}</p>
                                          <p><strong>Age:</strong> {resident.age}</p>
                                          <p><strong>Room:</strong> {resident.room}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {/* Staff */}
                                {report.staff_involved && Array.isArray(report.staff_involved) && report.staff_involved.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold text-sm text-gray-600 mb-2">Staff Involved</h4>
                                    <div className="space-y-2">
                                      {(report.staff_involved as any[]).map((staff: any, index: number) => (
                                        <div key={index} className="text-sm bg-green-50 p-2 rounded">
                                          <p><strong>Name:</strong> {staff.name}</p>
                                          <p><strong>Position:</strong> {staff.position}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {/* Visitors */}
                                {report.visitors_involved && Array.isArray(report.visitors_involved) && report.visitors_involved.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold text-sm text-gray-600 mb-2">Visitors Involved</h4>
                                    <div className="space-y-2">
                                      {(report.visitors_involved as any[]).map((visitor: any, index: number) => (
                                        <div key={index} className="text-sm bg-purple-50 p-2 rounded">
                                          <p><strong>Name:</strong> {visitor.name}</p>
                                          <p><strong>Relationship:</strong> {visitor.relationship}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              {/* Witnesses */}
                              {report.witnesses && Array.isArray(report.witnesses) && report.witnesses.length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-sm text-gray-600 mb-2">Witnesses</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {(report.witnesses as any[]).map((witness: any, index: number) => (
                                      <div key={index} className="text-sm bg-yellow-50 p-2 rounded">
                                        <p><strong>Name:</strong> {witness.name}</p>
                                        <p><strong>Contact:</strong> {witness.contact}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Medical Information */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold text-sm text-gray-600 mb-2">Medical Treatment</h4>
                                  <p className="text-sm">{report.medical_treatment_provided ? 'Yes' : 'No'}</p>
                                </div>
                                {report.injuries_sustained && (
                                  <div>
                                    <h4 className="font-semibold text-sm text-gray-600 mb-2">Injuries Sustained</h4>
                                    <p className="text-sm bg-gray-50 p-2 rounded">{report.injuries_sustained}</p>
                                  </div>
                                )}
                              </div>
                              
                              {/* Causes and Factors */}
                              {(report.immediate_cause || report.contributing_factors) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {report.immediate_cause && (
                                    <div>
                                      <h4 className="font-semibold text-sm text-gray-600 mb-2">Immediate Cause</h4>
                                      <p className="text-sm bg-gray-50 p-3 rounded">{report.immediate_cause}</p>
                                    </div>
                                  )}
                                  {report.contributing_factors && (
                                    <div>
                                      <h4 className="font-semibold text-sm text-gray-600 mb-2">Contributing Factors</h4>
                                      <p className="text-sm bg-gray-50 p-3 rounded">{report.contributing_factors}</p>
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              {/* Response Actions */}
                              {report.immediate_actions_taken && (
                                <div>
                                  <h4 className="font-semibold text-sm text-gray-600 mb-2">Immediate Actions Taken</h4>
                                  <p className="text-sm bg-gray-50 p-3 rounded">{report.immediate_actions_taken}</p>
                                </div>
                              )}
                              
                              {/* Notifications and Follow-up */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                  <h4 className="font-semibold text-sm text-gray-600">Supervisor Notified</h4>
                                  <p className="text-sm">{report.supervisor_notified ? 'Yes' : 'No'}</p>
                                  {report.supervisor_name && (
                                    <p className="text-xs text-gray-500">Name: {report.supervisor_name}</p>
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-sm text-gray-600">Family Notified</h4>
                                  <p className="text-sm">{report.family_notified ? 'Yes' : 'No'}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-sm text-gray-600">Medical Professional</h4>
                                  <p className="text-sm">{report.medical_professional_contacted ? 'Yes' : 'No'}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-sm text-gray-600">Hospital Transport</h4>
                                  <p className="text-sm">{report.hospital_transport_required ? 'Yes' : 'No'}</p>
                                </div>
                              </div>
                              
                              {/* Additional Details */}
                              {(report.medical_professional_details || report.hospital_details || report.family_notification_details) && (
                                <div className="space-y-3">
                                  {report.medical_professional_details && (
                                    <div>
                                      <h4 className="font-semibold text-sm text-gray-600 mb-1">Medical Professional Details</h4>
                                      <p className="text-sm bg-gray-50 p-2 rounded">{report.medical_professional_details}</p>
                                    </div>
                                  )}
                                  {report.hospital_details && (
                                    <div>
                                      <h4 className="font-semibold text-sm text-gray-600 mb-1">Hospital Details</h4>
                                      <p className="text-sm bg-gray-50 p-2 rounded">{report.hospital_details}</p>
                                    </div>
                                  )}
                                  {report.family_notification_details && (
                                    <div>
                                      <h4 className="font-semibold text-sm text-gray-600 mb-1">Family Notification Details</h4>
                                      <p className="text-sm bg-gray-50 p-2 rounded">{report.family_notification_details}</p>
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              {/* Documentation and Follow-up */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                  <h4 className="font-semibold text-sm text-gray-600">Photos Taken</h4>
                                  <p className="text-sm">{report.photos_taken ? 'Yes' : 'No'}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-sm text-gray-600">Evidence Collected</h4>
                                  <p className="text-sm">{report.evidence_collected ? 'Yes' : 'No'}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-sm text-gray-600">Regulatory Reporting</h4>
                                  <p className="text-sm">{report.regulatory_reporting_required ? 'Yes' : 'No'}</p>
                                </div>
                              </div>
                              
                              {/* Additional Documentation */}
                              {(report.additional_documentation || report.regulatory_agencies || report.follow_up_actions_required || report.incident_prevention_measures) && (
                                <div className="space-y-3">
                                  {report.regulatory_agencies && (
                                    <div>
                                      <h4 className="font-semibold text-sm text-gray-600 mb-1">Regulatory Agencies</h4>
                                      <p className="text-sm bg-gray-50 p-2 rounded">{report.regulatory_agencies}</p>
                                    </div>
                                  )}
                                  {report.follow_up_actions_required && (
                                    <div>
                                      <h4 className="font-semibold text-sm text-gray-600 mb-1">Follow-up Actions Required</h4>
                                      <p className="text-sm bg-gray-50 p-2 rounded">{report.follow_up_actions_required}</p>
                                    </div>
                                  )}
                                  {report.incident_prevention_measures && (
                                    <div>
                                      <h4 className="font-semibold text-sm text-gray-600 mb-1">Prevention Measures</h4>
                                      <p className="text-sm bg-gray-50 p-2 rounded">{report.incident_prevention_measures}</p>
                                    </div>
                                  )}
                                  {report.additional_documentation && (
                                    <div>
                                      <h4 className="font-semibold text-sm text-gray-600 mb-1">Additional Documentation</h4>
                                      <p className="text-sm bg-gray-50 p-2 rounded">{report.additional_documentation}</p>
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              {/* Manager Review Section */}
                              {(report.resolved !== null || report.actions_taken_outcome) && (
                                <div className="border-t pt-4">
                                  <h3 className="font-semibold text-lg mb-3">Manager Review</h3>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {report.resolved !== null && (
                                      <div>
                                        <h4 className="font-semibold text-sm text-gray-600 mb-1">Resolution Status</h4>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                          report.resolved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                          {report.resolved ? 'Resolved' : 'Not Resolved'}
                                        </span>
                                      </div>
                                    )}
                                    {report.reviewed_at && (
                                      <div>
                                        <h4 className="font-semibold text-sm text-gray-600 mb-1">Reviewed Date</h4>
                                        <p className="text-sm">{formatDate(new Date(report.reviewed_at))}</p>
                                      </div>
                                    )}
                                  </div>
                                  {report.actions_taken_outcome && (
                                    <div className="mt-3">
                                      <h4 className="font-semibold text-sm text-gray-600 mb-1">Actions Taken and Outcome</h4>
                                      <p className="text-sm bg-blue-50 p-3 rounded">{report.actions_taken_outcome}</p>
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              {/* Report Metadata */}
                              <div className="border-t pt-4 text-xs text-gray-500">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <strong>Report Created:</strong> {formatDate(new Date(report.created_at))}
                                  </div>
                                  {report.submitted_at && (
                                    <div>
                                      <strong>Submitted:</strong> {formatDate(new Date(report.submitted_at))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        {report.resolved === null ? (
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => handleManagerReview(report)}
                          >
                            <Settings className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleArchive(report)}
                          >
                            <Archive className="h-4 w-4 mr-1" />
                            Archive
                          </Button>
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
      
      <ManagerReviewDialog 
        report={selectedReport}
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        onReviewComplete={handleReviewComplete}
      />
    </Card>
  );
};
