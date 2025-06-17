
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PersonInvolved {
  id: string;
  name: string;
  role: string;
  contactInfo?: string;
  statement?: string;
}

export interface IncidentFormData {
  // Basic incident details
  incidentDate: string;
  incidentTime: string;
  location: string;
  incidentType: string;
  severityLevel: string;
  
  // Incident description
  incidentDescription: string;
  immediateCause: string;
  contributingFactors: string;
  
  // People involved
  residentsInvolved: PersonInvolved[];
  staffInvolved: PersonInvolved[];
  visitorsInvolved: PersonInvolved[];
  witnesses: PersonInvolved[];
  
  // Medical information
  injuriesSustained: string;
  medicalTreatmentProvided: boolean;
  medicalProfessionalContacted: boolean;
  medicalProfessionalDetails: string;
  hospitalTransportRequired: boolean;
  hospitalDetails: string;
  
  // Immediate response
  immediateActionsTaken: string;
  supervisorNotified: boolean;
  supervisorName: string;
  supervisorNotificationTime: string;
  familyNotified: boolean;
  familyNotificationDetails: string;
  
  // Regulatory and follow-up
  regulatoryReportingRequired: boolean;
  regulatoryAgencies: string;
  followUpActionsRequired: string;
  incidentPreventionMeasures: string;
  
  // Documentation
  photosTaken: boolean;
  evidenceCollected: boolean;
  additionalDocumentation: string;
  
  // Status
  reportStatus: 'draft' | 'submitted' | 'reviewed';
}

export const useIncidentForm = (user: any) => {
  const [formData, setFormData] = useState<IncidentFormData>(() => ({
    // Basic incident details
    incidentDate: new Date().toISOString().split('T')[0],
    incidentTime: new Date().toTimeString().slice(0, 5),
    location: '',
    incidentType: '',
    severityLevel: '',
    
    // Incident description
    incidentDescription: '',
    immediateCause: '',
    contributingFactors: '',
    
    // People involved
    residentsInvolved: [],
    staffInvolved: [],
    visitorsInvolved: [],
    witnesses: [],
    
    // Medical information
    injuriesSustained: '',
    medicalTreatmentProvided: false,
    medicalProfessionalContacted: false,
    medicalProfessionalDetails: '',
    hospitalTransportRequired: false,
    hospitalDetails: '',
    
    // Immediate response
    immediateActionsTaken: '',
    supervisorNotified: false,
    supervisorName: '',
    supervisorNotificationTime: '',
    familyNotified: false,
    familyNotificationDetails: '',
    
    // Regulatory and follow-up
    regulatoryReportingRequired: false,
    regulatoryAgencies: '',
    followUpActionsRequired: '',
    incidentPreventionMeasures: '',
    
    // Documentation
    photosTaken: false,
    evidenceCollected: false,
    additionalDocumentation: '',
    
    // Status
    reportStatus: 'draft'
  }));

  const [reportId, setReportId] = useState<string | null>(null);

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  }, []);

  const autoSave = useCallback(async () => {
    if (!user || !formData.incidentDescription) return;

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
        report_status: formData.reportStatus,
        last_saved_at: new Date().toISOString(),
        auto_save_data: JSON.parse(JSON.stringify(formData))
      };

      if (reportId) {
        await supabase
          .from('incident_reports')
          .update(reportData)
          .eq('id', reportId);
      } else {
        const { data, error } = await supabase
          .from('incident_reports')
          .insert(reportData)
          .select()
          .single();

        if (data && !error) {
          setReportId(data.id);
        }
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, [user, formData, reportId]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(autoSave, 30000);
    return () => clearInterval(interval);
  }, [autoSave]);

  return { formData, handleInputChange, autoSave, reportId };
};
