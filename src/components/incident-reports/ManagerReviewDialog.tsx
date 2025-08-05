import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type IncidentReport = Tables<'incident_reports'>;

interface ManagerReviewDialogProps {
  report: IncidentReport | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReviewComplete: () => void;
}

export const ManagerReviewDialog = ({ 
  report, 
  open, 
  onOpenChange, 
  onReviewComplete 
}: ManagerReviewDialogProps) => {
  const [resolved, setResolved] = useState<string>(
    report?.resolved === null ? "" : report?.resolved ? "yes" : "no"
  );
  const [actionsTaken, setActionsTaken] = useState(report?.actions_taken_outcome || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!report) return;
    
    if (!resolved) {
      toast.error("Please select whether the incident is resolved");
      return;
    }

    if (!actionsTaken.trim()) {
      toast.error("Please provide details of actions taken and outcome");
      return;
    }

    setLoading(true);

    try {
      console.log("ManagerReviewDialog: Updating report", report.id, "with resolved:", resolved === "yes");
      
      const { error } = await supabase
        .from('incident_reports')
        .update({
          resolved: resolved === "yes",
          actions_taken_outcome: actionsTaken.trim(),
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', report.id);

      if (error) throw error;

      console.log("ManagerReviewDialog: Update successful, calling onReviewComplete");
      toast.success("Manager review completed successfully");
      onReviewComplete();
      onOpenChange(false);
    } catch (error) {
      console.error('ManagerReviewDialog: Error updating incident report:', error);
      toast.error('Failed to complete manager review');
    } finally {
      setLoading(false);
    }
  };

  if (!report) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manager Review - Incident Report</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Incident Summary */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Incident Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Date:</span> {new Date(report.incident_date).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Type:</span> {report.incident_type}
              </div>
              <div>
                <span className="font-medium">Severity:</span> {report.severity_level}
              </div>
              <div>
                <span className="font-medium">Location:</span> {report.location}
              </div>
            </div>
            <div className="mt-2">
              <span className="font-medium">Description:</span>
              <p className="text-sm mt-1">{report.incident_description}</p>
            </div>
          </div>

          {/* Manager Review Fields */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold">Is this incident resolved?</Label>
              <RadioGroup value={resolved} onValueChange={setResolved} className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="resolved-yes" />
                  <Label htmlFor="resolved-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="resolved-no" />
                  <Label htmlFor="resolved-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="actions-taken" className="text-base font-semibold">
                Actions Taken and Outcome
              </Label>
              <Textarea
                id="actions-taken"
                value={actionsTaken}
                onChange={(e) => setActionsTaken(e.target.value)}
                placeholder="Describe the actions taken to address this incident and the outcome..."
                className="mt-2 min-h-[120px]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : "Complete Review"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};