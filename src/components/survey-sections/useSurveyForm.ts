
import { useState, useEffect } from 'react';

export interface MeetingEntry {
  id: string;
  date: string;
  time: string;
  name: string;
}

export interface QuestionPhotos {
  [questionField: string]: File[];
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
  otsCount: string;
  phase1Count: string;
  phase2Count: string;
  phase1Completions: string;
  phase1NextSteps: string;
  phase2Completions: string;
  phase2NextSteps: string;
  gedPreparationStarts: string;
  gedCompletions: string;
  lifeSkillsStarts: string;
  driversLicenseReceived: string;
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
  questionPhotos: QuestionPhotos;
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
    otsCount: '',
    phase1Count: '',
    phase2Count: '',
    phase1Completions: '',
    phase1NextSteps: '',
    phase2Completions: '',
    phase2NextSteps: '',
    gedPreparationStarts: '',
    gedCompletions: '',
    lifeSkillsStarts: '',
    driversLicenseReceived: '',
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
    photos: [],
    questionPhotos: {}
  }));

  // Debug form data changes
  useEffect(() => {
    console.log('🚨 formData changed:', formData);
  }, [formData]);

  useEffect(() => {
    console.log('🚨 useSurveyForm mounted');
    return () => console.log('🚨 useSurveyForm unmounted');
  }, []);

  const handleInputChange = (field: string, value: string | MeetingEntry[] | File[] | QuestionPhotos) => {
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

  const handleQuestionPhotosChange = (questionField: string, photos: File[]) => {
    console.log('🔶 handleQuestionPhotosChange', questionField, photos);
    setFormData(prevData => ({
      ...prevData,
      questionPhotos: {
        ...prevData.questionPhotos,
        [questionField]: photos
      }
    }));
  };

  return { formData, handleInputChange, handleQuestionPhotosChange };
};
