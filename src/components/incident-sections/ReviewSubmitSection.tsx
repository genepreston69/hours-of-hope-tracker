
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { IncidentFormData } from './useIncidentForm';
import { supabase } from '@/integrations/supabase/client';

interface ReviewSubmitSectionProps {
  formData: IncidentFormData;
  handleInputChange: (field: string, value: any) => void;
  prevStep: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  navigate: (path: string) => void;
  user: any;
}

export const ReviewSubmitSection = ({ 
  formData, 
  handleInputChange,
  prevStep,
  isSubmitting,
  setIsSubmitting,
  navigate,
  user
}: ReviewSubmitSectionProps) => {
  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const reportData = {
        user_id: user.id,
        incident_date: formData.incidentDate,
        incident_time: formData.incidentTime,
        location: formData.location,
        incident_type: formData.incidentType,
        severity_level: formData.severityLevel,
        incident_description: formData.incidentDescription,
        immediate_cause: formData.immediateCause,
        contributing_factors: formData.contributingFactors,
        residents_involved: JSON.parse(JSON.stringify(formData.residentsInvolved)),
        staff_involved: JSON.parse(JSON.stringify(formData.staffInvolved)),
        visitors_involved: JSON.parse(JSON.stringify(formData.visitorsInvolved)),
        witnesses: JSON.parse(JSON.stringify(formData.witnesses)),
        injuries_sustained: formData.injuriesSustained,
        medical_treatment_provided: formData.medicalTreatmentProvided,
        medical_professional_contacted: formData.medicalProfessionalContacted,
        medical_professional_details: formData.medicalProfessionalDetails,
        hospital_transport_required: formData.hospitalTransportRequired,
        hospital_details: formData.hospitalDetails,
        immediate_actions_taken: formData.immediateActionsTaken,
        supervisor_notified: formData.supervisorNotified,
        supervisor_name: formData.supervisorName,
        supervisor_notification_time: formData.supervisorNotificationTime ? new Date(formData.supervisorNotificationTime).toISOString() : null,
        family_notified: formData.familyNotified,
        family_notification_details: formData.familyNotificationDetails,
        regulatory_reporting_required: formData.regulatoryReportingRequired,
        regulatory_agencies: formData.regulatoryAgencies,
        follow_up_actions_required: formData.followUpActionsRequired,
        incident_prevention_measures: formData.incidentPreventionMeasures,
        photos_taken: formData.photosTaken,
        evidence_collected: formData.evidenceCollected,
        additional_documentation: formData.additionalDocumentation,
        report_status: 'submitted',
        submitted_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('incident_reports')
        .insert(reportData)
        .select();

      if (error) throw error;

      // Send notifications
      try {
        const reportId = data[0].id;
        console.log("Sending notifications for incident report:", reportId);
        
        const notificationResponse = await supabase.functions.invoke('send-notifications', {
          body: {
            reportId,
            reportType: 'incident',
            reportData: data[0]
          }
        });
        
        if (notificationResponse.error) {
          console.error("Error sending notifications:", notificationResponse.error);
        } else {
          console.log("Notifications sent successfully:", notificationResponse.data);
        }
      } catch (notificationError) {
        console.error("Notification error:", notificationError);
        // Don't fail the submission if notifications fail
      }

      handleInputChange('reportStatus', 'submitted');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting incident report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'major': return 'bg-orange-500';
      case 'moderate': return 'bg-yellow-500';
      case 'minor': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h2>
        <p className="text-gray-600">Please review all information before submitting the incident report.</p>
      </div>

      <div className="grid gap-6">
        {/* Incident Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Incident Overview
              <Badge className={getSeverityColor(formData.severityLevel)}>
                {formData.severityLevel}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Date:</strong> {formData.incidentDate}</p>
            <p><strong>Time:</strong> {formData.incidentTime}</p>
            <p><strong>Location:</strong> {formData.location}</p>
            <p><strong>Type:</strong> {formData.incidentType}</p>
          </CardContent>
        </Card>

        {/* People Involved Summary */}
        <Card>
          <CardHeader>
            <CardTitle>People Involved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p><strong>Residents:</strong> {formData.residentsInvolved.length}</p>
                <p><strong>Staff:</strong> {formData.staffInvolved.length}</p>
              </div>
              <div>
                <p><strong>Visitors:</strong> {formData.visitorsInvolved.length}</p>
                <p><strong>Witnesses:</strong> {formData.witnesses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical Response */}
        {(formData.medicalTreatmentProvided || formData.hospitalTransportRequired) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                Medical Response Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {formData.medicalTreatmentProvided && (
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  <span>Medical treatment provided</span>
                </div>
              )}
              {formData.hospitalTransportRequired && (
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  <span>Hospital transport arranged</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Regulatory Requirements */}
        {formData.regulatoryReportingRequired && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-600" />
                Regulatory Reporting Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{formData.regulatoryAgencies}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Before Submitting</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Ensure all required fields are completed accurately</li>
          <li>• Verify contact information for all involved parties</li>
          <li>• Confirm incident details are objective and factual</li>
          <li>• Review follow-up actions and prevention measures</li>
        </ul>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-red-600 hover:bg-red-700"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </Button>
      </div>
    </div>
  );
};
