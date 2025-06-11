import { useState, useEffect } from 'react';

export interface MeetingEntry {
  id: string;
  date: string;
  time: string;
  name: string;
}

export interface FormData {
  // Report Details
  programName: string;
  reportDate: string;
  reporterName: string;
  
  // Program Highlights
  weekSummary: string;
  events: string;
  upcomingEvents: string;
  accomplishments: string;
  
  // Staffing
  staffMeetings: string;
  meetingEntries: MeetingEntry[];
  evaluations: string;
  evaluationDetails: string;
  staffingNeeds: string;
  
  // Resident Data
  phase1Count: string;
  phase2Count: string;
  phase1Completions: string;
  phase1NextSteps: string;
  phase2Completions: string;
  phase2NextSteps: string;
  peerMentors: string;
  matClients: string;
  totalIntakes: string;
  matIntakes: string;
  courtIntakes: string;
  scheduledIntakes: string;
  ots1Orientations: string;
  discharges: string;
  dischargeReasons: string;
  drugScreens: string;
  
  // Facility
  facilityIssues: string;
  supplyNeeds: string;
  programConcerns: string;
  
  // Additional
  celebrations: string;
  additionalComments: string;
  
  // Photos
  photos: File[];
}

export const useSurveyForm = (user: any) => {
  const [formData, setFormData] = useState<FormData>(() => ({
    // Report Details
    programName: '',
    reportDate: new Date().toISOString().split('T')[0],
    reporterName: user?.user_metadata?.full_name || user?.email || '',
    
    // Program Highlights
    weekSummary: '',
    events: '',
    upcomingEvents: '',
    accomplishments: '',
    
    // Staffing
    staffMeetings: '',
    meetingEntries: [],
    evaluations: '',
    evaluationDetails: '',
    staffingNeeds: '',
    
    // Resident Data
    phase1Count: '',
    phase2Count: '',
    phase1Completions: '',
    phase1NextSteps: '',
    phase2Completions: '',
    phase2NextSteps: '',
    peerMentors: '',
    matClients: '',
    totalIntakes: '',
    matIntakes: '',
    courtIntakes: '',
    scheduledIntakes: '',
    ots1Orientations: '',
    discharges: '',
    dischargeReasons: '',
    drugScreens: '',
    
    // Facility
    facilityIssues: '',
    supplyNeeds: '',
    programConcerns: '',
    
    // Additional
    celebrations: '',
    additionalComments: '',
    
    // Photos
    photos: []
  }));

  // Debug form data changes
  useEffect(() => {
    console.log('🚨 formData changed:', formData);
  }, [formData]);

  // Debug component lifecycle
  useEffect(() => {
    console.log('🚨 useSurveyForm mounted');
    return () => console.log('🚨 useSurveyForm unmounted');
  }, []);

  const handleInputChange = (field: string, value: string | MeetingEntry[] | File[]) => {
    console.log('🔶 handleInputChange PRE-UPDATE', field, formData);
    setFormData(prevData => {
      const newData = { 
        ...prevData, 
        [field]: value 
      };
      console.log('🔶 handleInputChange POST-UPDATE', field, newData);
      return newData;
    });
  };

  return { formData, handleInputChange };
};
