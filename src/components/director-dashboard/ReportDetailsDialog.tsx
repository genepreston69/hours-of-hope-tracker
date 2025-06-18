import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface RecoverySurvey {
  id: string;
  report_date: string;
  program_name: string;
  reporter_name: string;
  week_summary: string;
  events: string;
  upcoming_events: string;
  accomplishments: string;
  staff_meetings: number;
  meeting_dates: string;
  evaluations: string;
  evaluation_details: string;
  staffing_needs: string;
  phase1_count: number;
  phase2_count: number;
  phase1_completions: number;
  phase1_next_steps: string;
  phase2_completions: number;
  phase2_next_steps: string;
  peer_mentors: number;
  mat_clients: number;
  total_intakes: number;
  mat_intakes: number;
  court_intakes: number;
  scheduled_intakes: number;
  ots1_orientations: number;
  ots_count: number;
  discharges: number;
  discharge_reasons: string;
  drug_screens: number;
  facility_issues: string;
  supply_needs: string;
  program_concerns: string;
  celebrations: string;
  additional_comments: string;
  created_at: string;
  user_id: string;
}

interface ReportDetailsDialogProps {
  selectedSurvey: RecoverySurvey | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Function to strip HTML tags from text
const stripHtml = (html: string) => {
  if (!html) return '';
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || '';
};

export const ReportDetailsDialog = ({ selectedSurvey, open, onOpenChange }: ReportDetailsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Director Report Details</DialogTitle>
          <DialogDescription>
            Report from {selectedSurvey && new Date(selectedSurvey.report_date).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        {selectedSurvey && (
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-6">
              {/* Program Information */}
              <div>
                <h4 className="font-semibold mb-3">Program Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Program</p>
                    <p className="font-medium">{stripHtml(selectedSurvey.program_name) || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Reporter</p>
                    <p className="font-medium">{stripHtml(selectedSurvey.reporter_name) || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Report Date</p>
                    <p className="font-medium">{new Date(selectedSurvey.report_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Staff Meetings</p>
                    <p className="font-medium">{selectedSurvey.staff_meetings || 0} meetings</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Week Summary */}
              {selectedSurvey.week_summary && (
                <>
                  <div>
                    <h4 className="font-semibold mb-2">Week Summary</h4>
                    <p className="text-sm">{stripHtml(selectedSurvey.week_summary)}</p>
                  </div>
                  <Separator />
                </>
              )}

              {/* Events */}
              {(selectedSurvey.events || selectedSurvey.upcoming_events) && (
                <>
                  <div>
                    <h4 className="font-semibold mb-3">Events</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedSurvey.events && (
                        <div>
                          <p className="text-sm text-muted-foreground">Recent Events</p>
                          <p className="text-sm">{stripHtml(selectedSurvey.events)}</p>
                        </div>
                      )}
                      {selectedSurvey.upcoming_events && (
                        <div>
                          <p className="text-sm text-muted-foreground">Upcoming Events</p>
                          <p className="text-sm">{stripHtml(selectedSurvey.upcoming_events)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Accomplishments */}
              {selectedSurvey.accomplishments && (
                <>
                  <div>
                    <h4 className="font-semibold mb-2">Accomplishments</h4>
                    <p className="text-sm">{stripHtml(selectedSurvey.accomplishments)}</p>
                  </div>
                  <Separator />
                </>
              )}

              {/* Staff Meetings Details */}
              {(selectedSurvey.meeting_dates || selectedSurvey.evaluations || selectedSurvey.evaluation_details || selectedSurvey.staffing_needs) && (
                <>
                  <div>
                    <h4 className="font-semibold mb-3">Staff Meetings Details</h4>
                    <div className="space-y-3">
                      {selectedSurvey.meeting_dates && (
                        <div>
                          <p className="text-sm text-muted-foreground">Meeting Dates</p>
                          <p className="text-sm">{stripHtml(selectedSurvey.meeting_dates)}</p>
                        </div>
                      )}
                      {selectedSurvey.evaluations && (
                        <div>
                          <p className="text-sm text-muted-foreground">Evaluations</p>
                          <p className="text-sm">{stripHtml(selectedSurvey.evaluations)}</p>
                        </div>
                      )}
                      {selectedSurvey.evaluation_details && (
                        <div>
                          <p className="text-sm text-muted-foreground">Evaluation Details</p>
                          <p className="text-sm">{stripHtml(selectedSurvey.evaluation_details)}</p>
                        </div>
                      )}
                      {selectedSurvey.staffing_needs && (
                        <div>
                          <p className="text-sm text-muted-foreground">Staffing Needs</p>
                          <p className="text-sm">{stripHtml(selectedSurvey.staffing_needs)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Resident Data */}
              <div>
                <h4 className="font-semibold mb-3">Resident Data</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Phase 1 Count</p>
                    <p className="text-lg font-semibold">{selectedSurvey.phase1_count || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phase 2 Count</p>
                    <p className="text-lg font-semibold">{selectedSurvey.phase2_count || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Peer Mentors</p>
                    <p className="text-lg font-semibold">{selectedSurvey.peer_mentors || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phase 1 Completions</p>
                    <p className="text-lg font-semibold">{selectedSurvey.phase1_completions || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phase 2 Completions</p>
                    <p className="text-lg font-semibold">{selectedSurvey.phase2_completions || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">MAT Clients</p>
                    <p className="text-lg font-semibold">{selectedSurvey.mat_clients || 0}</p>
                  </div>
                </div>
                {(selectedSurvey.phase1_next_steps || selectedSurvey.phase2_next_steps) && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {selectedSurvey.phase1_next_steps && (
                      <div>
                        <p className="text-sm text-muted-foreground">Phase 1 Next Steps</p>
                        <p className="text-sm">{stripHtml(selectedSurvey.phase1_next_steps)}</p>
                      </div>
                    )}
                    {selectedSurvey.phase2_next_steps && (
                      <div>
                        <p className="text-sm text-muted-foreground">Phase 2 Next Steps</p>
                        <p className="text-sm">{stripHtml(selectedSurvey.phase2_next_steps)}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Separator />

              {/* Intake Information */}
              <div>
                <h4 className="font-semibold mb-3">Intake Information</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Intakes</p>
                    <p className="text-lg font-semibold">{selectedSurvey.total_intakes || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">MAT Intakes</p>
                    <p className="text-lg font-semibold">{selectedSurvey.mat_intakes || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Court Intakes</p>
                    <p className="text-lg font-semibold">{selectedSurvey.court_intakes || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Scheduled Intakes</p>
                    <p className="text-lg font-semibold">{selectedSurvey.scheduled_intakes || 0}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* OTS Information */}
              <div>
                <h4 className="font-semibold mb-3">OTS Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">OTS Count</p>
                    <p className="text-lg font-semibold">{selectedSurvey.ots_count || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">OTS1 Orientations</p>
                    <p className="text-lg font-semibold">{selectedSurvey.ots1_orientations || 0}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Other Metrics */}
              <div>
                <h4 className="font-semibold mb-3">Other Metrics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Discharges</p>
                    <p className="text-lg font-semibold">{selectedSurvey.discharges || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Drug Screens</p>
                    <p className="text-lg font-semibold">{selectedSurvey.drug_screens || 0}</p>
                  </div>
                </div>
                {selectedSurvey.discharge_reasons && (
                  <div className="mt-3">
                    <p className="text-sm text-muted-foreground">Discharge Reasons</p>
                    <p className="text-sm">{stripHtml(selectedSurvey.discharge_reasons)}</p>
                  </div>
                )}
              </div>

              {/* Additional Information */}
              {(selectedSurvey.facility_issues || selectedSurvey.supply_needs || selectedSurvey.program_concerns || selectedSurvey.celebrations || selectedSurvey.additional_comments) && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-3">Additional Information</h4>
                    <div className="space-y-3">
                      {selectedSurvey.facility_issues && (
                        <div>
                          <p className="text-sm text-muted-foreground">Facility Issues</p>
                          <p className="text-sm">{stripHtml(selectedSurvey.facility_issues)}</p>
                        </div>
                      )}
                      {selectedSurvey.supply_needs && (
                        <div>
                          <p className="text-sm text-muted-foreground">Supply Needs</p>
                          <p className="text-sm">{stripHtml(selectedSurvey.supply_needs)}</p>
                        </div>
                      )}
                      {selectedSurvey.program_concerns && (
                        <div>
                          <p className="text-sm text-muted-foreground">Program Concerns</p>
                          <p className="text-sm">{stripHtml(selectedSurvey.program_concerns)}</p>
                        </div>
                      )}
                      {selectedSurvey.celebrations && (
                        <div>
                          <p className="text-sm text-muted-foreground">Celebrations</p>
                          <p className="text-sm">{stripHtml(selectedSurvey.celebrations)}</p>
                        </div>
                      )}
                      {selectedSurvey.additional_comments && (
                        <div>
                          <p className="text-sm text-muted-foreground">Additional Comments</p>
                          <p className="text-sm">{stripHtml(selectedSurvey.additional_comments)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};
