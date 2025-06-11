import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { SectionProps } from './types';

export const ReviewSection: React.FC<SectionProps> = ({ 
  formData, 
  prevStep, 
  isSubmitting, 
  setIsSubmitting, 
  navigate, 
  user 
}) => {
  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a survey",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting?.(true);
    
    try {
      // Convert meeting entries to a string format for the database
      const meetingDatesString = formData.meetingEntries
        .map(meeting => `${meeting.date} ${meeting.time} - ${meeting.name}`)
        .join('; ');

      // Convert form data to match database schema
      const surveyData = {
        user_id: user.id,
        program_name: formData.programName,
        report_date: formData.reportDate,
        reporter_name: formData.reporterName,
        week_summary: formData.weekSummary || null,
        events: formData.events || null,
        upcoming_events: formData.upcomingEvents || null,
        accomplishments: formData.accomplishments || null,
        staff_meetings: formData.staffMeetings ? parseInt(formData.staffMeetings) : null,
        meeting_dates: meetingDatesString || null,
        evaluations: formData.evaluations || null,
        evaluation_details: formData.evaluationDetails || null,
        staffing_needs: formData.staffingNeeds || null,
        phase1_count: formData.phase1Count ? parseInt(formData.phase1Count) : null,
        phase2_count: formData.phase2Count ? parseInt(formData.phase2Count) : null,
        phase1_completions: formData.phase1Completions ? parseInt(formData.phase1Completions) : null,
        phase1_next_steps: formData.phase1NextSteps || null,
        phase2_completions: formData.phase2Completions ? parseInt(formData.phase2Completions) : null,
        phase2_next_steps: formData.phase2NextSteps || null,
        peer_mentors: formData.peerMentors ? parseInt(formData.peerMentors) : null,
        mat_clients: formData.matClients ? parseInt(formData.matClients) : null,
        total_intakes: formData.totalIntakes ? parseInt(formData.totalIntakes) : null,
        mat_intakes: formData.matIntakes ? parseInt(formData.matIntakes) : null,
        court_intakes: formData.courtIntakes ? parseInt(formData.courtIntakes) : null,
        scheduled_intakes: formData.scheduledIntakes ? parseInt(formData.scheduledIntakes) : null,
        ots1_orientations: formData.ots1Orientations ? parseInt(formData.ots1Orientations) : null,
        discharges: formData.discharges ? parseInt(formData.discharges) : null,
        discharge_reasons: formData.dischargeReasons || null,
        drug_screens: formData.drugScreens ? parseInt(formData.drugScreens) : null,
        facility_issues: formData.facilityIssues || null,
        supply_needs: formData.supplyNeeds || null,
        program_concerns: formData.programConcerns || null,
        celebrations: formData.celebrations || null,
        additional_comments: formData.additionalComments || null
      };

      console.log('Submitting survey data:', surveyData);
      console.log('Photos to upload:', formData.photos.length);

      const { data, error } = await supabase
        .from('recovery_surveys')
        .insert([surveyData])
        .select();

      if (error) {
        console.error('Error submitting survey:', error);
        toast({
          title: "Error",
          description: "Failed to submit survey: " + error.message,
          variant: "destructive"
        });
        return;
      }

      console.log('Survey submitted successfully:', data);
      toast({
        title: "Success",
        description: "Recovery survey submitted successfully!",
      });
      
      // Navigate to reports page to view the submitted survey
      navigate?.('/reports');
      
    } catch (error) {
      console.error('Unexpected error submitting survey:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while submitting the survey",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting?.(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Review Your Report</h2>
      
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div>
          <h3 className="font-semibold text-gray-700">Report Details</h3>
          <p className="text-sm text-gray-600">Program: {formData.programName || 'Not provided'}</p>
          <p className="text-sm text-gray-600">Date: {formData.reportDate}</p>
          <p className="text-sm text-gray-600">Submitted by: {formData.reporterName || 'Not provided'}</p>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-700">Key Metrics</h3>
          <p className="text-sm text-gray-600">Phase 1 Residents: {formData.phase1Count || '0'}</p>
          <p className="text-sm text-gray-600">Phase 2 Residents: {formData.phase2Count || '0'}</p>
          <p className="text-sm text-gray-600">Total Intakes: {formData.totalIntakes || '0'}</p>
          <p className="text-sm text-gray-600">Discharges: {formData.discharges || '0'}</p>
        </div>
        
        {formData.meetingEntries.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-700">Staff Meetings</h3>
            {formData.meetingEntries.map((meeting, index) => (
              <p key={meeting.id} className="text-sm text-gray-600">
                {index + 1}. {meeting.name} - {meeting.date} at {meeting.time}
              </p>
            ))}
          </div>
        )}
        
        {formData.photos.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-700">Attached Photos</h3>
            <p className="text-sm text-gray-600">{formData.photos.length} photo(s) selected</p>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mt-2">
              {formData.photos.slice(0, 8).map((photo, index) => (
                <div key={index} className="aspect-square bg-gray-200 rounded overflow-hidden">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {formData.photos.length > 8 && (
                <div className="aspect-square bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-500">+{formData.photos.length - 8} more</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> You can attach photos after submission through the document management system.
        </p>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="text-gray-600 hover:text-gray-800"
          disabled={isSubmitting}
        >
          ← Back to Edit
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </div>
    </div>
  );
};
