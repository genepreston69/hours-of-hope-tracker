import React, { useState, useEffect } from 'react';
import { ChevronRight, Check, Users, Home, FileText, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { TiptapEditor } from '@/components/ui/tiptap-editor';

const RecoveryPointSurvey = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  console.log('🔸 RecoveryPointSurvey render, currentStep:', currentStep);
  
  const [formData, setFormData] = useState(() => ({
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
    meetingDates: '',
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
    additionalComments: ''
  }));

  // Debug form data changes
  useEffect(() => {
    console.log('🚨 formData changed:', formData);
  }, [formData]);

  // Debug component lifecycle
  useEffect(() => {
    console.log('🚨 RecoveryPointSurvey mounted');
    return () => console.log('🚨 RecoveryPointSurvey unmounted');
  }, []);

  const sections = [
    {
      title: "Welcome",
      icon: <Home className="w-5 h-5" />,
      component: "welcome"
    },
    {
      title: "Report Details",
      icon: <FileText className="w-5 h-5" />,
      component: "reportDetails"
    },
    {
      title: "Program Highlights",
      icon: <MessageSquare className="w-5 h-5" />,
      component: "programHighlights"
    },
    {
      title: "Staffing Update",
      icon: <Users className="w-5 h-5" />,
      component: "staffing"
    },
    {
      title: "Resident Data",
      icon: <Users className="w-5 h-5" />,
      component: "residentData"
    },
    {
      title: "Facility Operations",
      icon: <Home className="w-5 h-5" />,
      component: "facility"
    },
    {
      title: "Additional Notes",
      icon: <MessageSquare className="w-5 h-5" />,
      component: "additional"
    },
    {
      title: "Review & Submit",
      icon: <Check className="w-5 h-5" />,
      component: "review"
    }
  ];

  const handleInputChange = (field: string, value: string) => {
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

  const nextStep = () => {
    if (currentStep < sections.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  function WelcomeSection() {
    console.log('WelcomeSection mounting');
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Weekly Program Survey</h2>
          <p className="text-lg text-gray-600 mb-8">
            Let's walk through your weekly report together. This should take about 10-15 minutes.
          </p>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">What we'll cover:</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-center">
              <Check className="w-4 h-4 mr-2" />
              Basic report information
            </li>
            <li className="flex items-center">
              <Check className="w-4 h-4 mr-2" />
              Program highlights and activities
            </li>
            <li className="flex items-center">
              <Check className="w-4 h-4 mr-2" />
              Staffing updates
            </li>
            <li className="flex items-center">
              <Check className="w-4 h-4 mr-2" />
              Resident data and outcomes
            </li>
            <li className="flex items-center">
              <Check className="w-4 h-4 mr-2" />
              Facility needs and concerns
            </li>
          </ul>
        </div>
        
        <div className="text-center">
          <button
            onClick={nextStep}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Let's Get Started
          </button>
        </div>
      </div>
    );
  }

  function ReportDetailsSection() {
    console.log('ReportDetailsSection mounting');
    const programOptions = ['RPB', 'RPC', 'RPH', 'RPP', 'Point Apartments'];
    
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">First, let's get some basic information</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Which program/facility is this report for? *
            </label>
            <Select value={formData.programName} onValueChange={(value) => handleInputChange('programName', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a program/facility" />
              </SelectTrigger>
              <SelectContent>
                {programOptions.map((program) => (
                  <SelectItem key={program} value={program}>
                    {program}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What date are you submitting this report? *
            </label>
            <Input
              type="date"
              value={formData.reportDate}
              onChange={(e) => handleInputChange('reportDate', e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your name *
            </label>
            <Input
              type="text"
              value={formData.reporterName}
              onChange={(e) => handleInputChange('reporterName', e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={nextStep}
            disabled={!formData.programName || !formData.reportDate || !formData.reporterName}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  function ProgramHighlightsSection() {
    console.log('ProgramHighlightsSection mounting');
    const [subStep, setSubStep] = useState(0);
    
    const questions = [
      {
        field: 'weekSummary',
        label: 'Tell us about this week',
        sublabel: 'Include successes, challenges, highlights, or ongoing needs',
        placeholder: 'Share what happened this week...'
      },
      {
        field: 'events',
        label: 'What events or volunteer projects did you complete?',
        sublabel: 'You can attach photos later',
        placeholder: 'List completed events and projects...'
      },
      {
        field: 'upcomingEvents',
        label: 'Any upcoming events or celebrations?',
        sublabel: 'Include dates and details',
        placeholder: 'Tell us what\'s coming up...'
      },
      {
        field: 'accomplishments',
        label: 'Major accomplishments worth highlighting?',
        sublabel: 'Initiatives, outcomes, or special achievements',
        placeholder: 'Share your wins...'
      }
    ];
    
    const currentQuestion = questions[subStep];
    
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{currentQuestion.label}</h2>
          {currentQuestion.sublabel && (
            <p className="text-gray-600 mt-2">{currentQuestion.sublabel}</p>
          )}
        </div>
        
        <div>
          <div style={{ position: 'relative', minHeight: '200px' }}>
            <TiptapEditor
              fieldName={currentQuestion.field}
              content={formData[currentQuestion.field as keyof typeof formData] as string || ''}
              onChange={(content) => {
                console.log('Program Highlights Tiptap onChange:', currentQuestion.field, content);
                handleInputChange(currentQuestion.field, content);
              }}
              placeholder={currentQuestion.placeholder}
            />
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={() => subStep > 0 ? setSubStep(subStep - 1) : prevStep()}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back
          </button>
          <button
            onClick={() => subStep < questions.length - 1 ? setSubStep(subStep + 1) : nextStep()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  function StaffingSection() {
    const [subStep, setSubStep] = useState(0);
    
    interface StaffingQuestion {
      field: string;
      label: string;
      type: string;
      placeholder?: string;
      sublabel?: string;
      options?: string[];
      showIf?: (data: any) => boolean;
    }
    
    const questions: StaffingQuestion[] = [
      {
        field: 'staffMeetings',
        label: 'How many staff meetings did you hold this week?',
        type: 'number',
        placeholder: 'Enter number'
      },
      {
        field: 'meetingDates',
        label: 'When were these meetings?',
        sublabel: 'List dates and times',
        type: 'textarea',
        placeholder: 'e.g., Monday 9am, Wednesday 2pm...'
      },
      {
        field: 'evaluations',
        label: 'Were any staff evaluations, supervisions, or trainings conducted?',
        type: 'radio',
        options: ['Yes', 'No']
      },
      {
        field: 'evaluationDetails',
        label: 'Tell us about the evaluations/trainings',
        sublabel: 'Type and who attended',
        type: 'textarea',
        placeholder: 'Describe the activities...',
        showIf: (data) => data.evaluations === 'Yes'
      },
      {
        field: 'staffingNeeds',
        label: 'Any staffing needs or issues?',
        type: 'textarea',
        placeholder: 'Share any concerns or needs...'
      }
    ];
    
    const visibleQuestions = questions.filter(q => !q.showIf || q.showIf(formData));
    const currentQuestion = visibleQuestions[subStep];
    
    if (!currentQuestion) {
      nextStep();
      return null;
    }
    
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{currentQuestion.label}</h2>
          {currentQuestion.sublabel && (
            <p className="text-gray-600 mt-2">{currentQuestion.sublabel}</p>
          )}
        </div>
        
        <div>
          {currentQuestion.type === 'number' && (
            <Input
              type="number"
              value={formData[currentQuestion.field as keyof typeof formData] as string || ''}
              onChange={(e) => handleInputChange(currentQuestion.field, e.target.value)}
              placeholder={currentQuestion.placeholder}
            />
          )}
          
          {currentQuestion.type === 'textarea' && (
            <TiptapEditor
              fieldName={currentQuestion.field}
              content={formData[currentQuestion.field as keyof typeof formData] as string || ''}
              onChange={(content) => {
                console.log('Staffing Tiptap onChange:', currentQuestion.field, content);
                handleInputChange(currentQuestion.field, content);
              }}
              placeholder={currentQuestion.placeholder}
            />
          )}
          
          {currentQuestion.type === 'radio' && currentQuestion.options && (
            <div className="space-y-3">
              {currentQuestion.options.map(option => (
                <label key={option} className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name={currentQuestion.field}
                    value={option}
                    checked={formData[currentQuestion.field as keyof typeof formData] === option}
                    onChange={(e) => handleInputChange(currentQuestion.field, e.target.value)}
                    className="mr-3"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={() => subStep > 0 ? setSubStep(subStep - 1) : prevStep()}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back
          </button>
          <button
            onClick={() => subStep < visibleQuestions.length - 1 ? setSubStep(subStep + 1) : nextStep()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  function ResidentDataSection() {
    const [subStep, setSubStep] = useState(0);
    
    interface ResidentDataItem {
      field: string;
      label: string;
      type: string;
      note?: string;
      showIf?: (data: any) => boolean;
    }
    
    interface ResidentDataGroup {
      group: string;
      items: ResidentDataItem[];
    }
    
    const questions: ResidentDataGroup[] = [
      {
        group: 'Current Residents',
        items: [
          { field: 'phase1Count', label: 'How many residents are currently in Phase 1?', type: 'number' },
          { field: 'phase2Count', label: 'How many residents are currently in Phase 2?', type: 'number' }
        ]
      },
      {
        group: 'Phase Completions',
        items: [
          { field: 'phase1Completions', label: 'Number of Phase 1 completions this week?', type: 'number', note: 'Photos can be added later' },
          { field: 'phase1NextSteps', label: 'Who completed Phase 1 and what are their next steps?', type: 'textarea', showIf: (data) => data.phase1Completions > 0 }
        ]
      },
      {
        group: 'Phase 2 Completions',
        items: [
          { field: 'phase2Completions', label: 'Number of Phase 2 completions this week?', type: 'number', note: 'Photos can be added later' },
          { field: 'phase2NextSteps', label: 'Who completed Phase 2 and what will they be doing now?', type: 'textarea', showIf: (data) => data.phase2Completions > 0 }
        ]
      },
      {
        group: 'Program Participation',
        items: [
          { field: 'peerMentors', label: 'Current number of peer mentors?', type: 'number' },
          { field: 'matClients', label: 'Number of MAT clients currently enrolled?', type: 'number' }
        ]
      },
      {
        group: 'Weekly Intakes',
        items: [
          { field: 'totalIntakes', label: 'Total number of intakes this week?', type: 'number' },
          { field: 'matIntakes', label: 'Number of MAT intakes this week?', type: 'number' },
          { field: 'courtIntakes', label: 'Number of court-ordered intakes this week?', type: 'number' },
          { field: 'scheduledIntakes', label: 'Number of intakes scheduled for next 7 days?', type: 'number' },
          { field: 'ots1Orientations', label: 'Number of residents oriented into OTS 1 this week?', type: 'number' }
        ]
      },
      {
        group: 'Discharges & Screens',
        items: [
          { field: 'discharges', label: 'Number of discharges this week?', type: 'number' },
          { field: 'dischargeReasons', label: 'What were the reasons for discharge?', type: 'textarea', showIf: (data) => data.discharges > 0 },
          { field: 'drugScreens', label: 'Number of confirmed positive drug screens this week?', type: 'number' }
        ]
      }
    ];
    
    const currentGroup = questions[subStep];
    const visibleItems = currentGroup.items.filter(item => !item.showIf || item.showIf(formData));
    
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{currentGroup.group}</h2>
          <div className="mt-1 h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${((subStep + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          {visibleItems.map((item, index) => (
            <div key={item.field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {item.label}
                {item.note && <span className="text-gray-500 text-sm ml-2">({item.note})</span>}
              </label>
              
              {item.type === 'number' && (
                <Input
                  type="number"
                  value={formData[item.field as keyof typeof formData] as string || ''}
                  onChange={(e) => handleInputChange(item.field, e.target.value)}
                  placeholder="Enter number"
                />
              )}
              
              {item.type === 'textarea' && (
                <TiptapEditor
                  fieldName={item.field}
                  content={formData[item.field as keyof typeof formData] as string || ''}
                  onChange={(content) => {
                    console.log('Resident Data Tiptap onChange:', item.field, content);
                    handleInputChange(item.field, content);
                  }}
                  placeholder="Enter details..."
                />
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={() => subStep > 0 ? setSubStep(subStep - 1) : prevStep()}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back
          </button>
          <button
            onClick={() => subStep < questions.length - 1 ? setSubStep(subStep + 1) : nextStep()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  function FacilitySection() {
    const [subStep, setSubStep] = useState(0);
    
    const questions = [
      {
        field: 'facilityIssues',
        label: 'Are there any facility or building issues that need addressed?',
        type: 'textarea',
        placeholder: 'Describe any maintenance or facility concerns...'
      },
      {
        field: 'supplyNeeds',
        label: 'Any immediate supply or equipment needs?',
        type: 'textarea',
        placeholder: 'List needed supplies or equipment...'
      },
      {
        field: 'programConcerns',
        label: 'Any programmatic concerns or areas needing support?',
        type: 'textarea',
        placeholder: 'Share any program-related concerns...'
      }
    ];
    
    const currentQuestion = questions[subStep];
    
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{currentQuestion.label}</h2>
        </div>
        
        <div>
          <TiptapEditor
            fieldName={currentQuestion.field}
            content={formData[currentQuestion.field as keyof typeof formData] as string || ''}
            onChange={(content) => {
              console.log('Facility Tiptap onChange:', currentQuestion.field, content);
              handleInputChange(currentQuestion.field, content);
            }}
            placeholder={currentQuestion.placeholder}
          />
          <p className="text-sm text-gray-500 mt-2">Leave blank if none</p>
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={() => subStep > 0 ? setSubStep(subStep - 1) : prevStep()}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back
          </button>
          <button
            onClick={() => subStep < questions.length - 1 ? setSubStep(subStep + 1) : nextStep()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  function AdditionalSection() {
    const [subStep, setSubStep] = useState(0);
    
    const questions = [
      {
        field: 'celebrations',
        label: 'Share any celebrations, resident milestones, or positive stories!',
        sublabel: 'This helps us highlight successes across programs',
        type: 'textarea',
        placeholder: 'Tell us about the good stuff...'
      },
      {
        field: 'additionalComments',
        label: 'Any other comments or observations?',
        type: 'textarea',
        placeholder: 'Anything else you\'d like to share...'
      }
    ];
    
    const currentQuestion = questions[subStep];
    
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{currentQuestion.label}</h2>
          {currentQuestion.sublabel && (
            <p className="text-gray-600 mt-2">{currentQuestion.sublabel}</p>
          )}
        </div>
        
        <div>
          <TiptapEditor
            fieldName={currentQuestion.field}
            content={formData[currentQuestion.field as keyof typeof formData] as string || ''}
            onChange={(content) => {
              console.log('Additional Tiptap onChange:', currentQuestion.field, content);
              handleInputChange(currentQuestion.field, content);
            }}
            placeholder={currentQuestion.placeholder}
          />
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={() => subStep > 0 ? setSubStep(subStep - 1) : prevStep()}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back
          </button>
          <button
            onClick={() => subStep < questions.length - 1 ? setSubStep(subStep + 1) : nextStep()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  function ReviewSection() {
    const handleSubmit = async () => {
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to submit a survey",
          variant: "destructive"
        });
        return;
      }

      setIsSubmitting(true);
      
      try {
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
          meeting_dates: formData.meetingDates || null,
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
        navigate('/reports');
        
      } catch (error) {
        console.error('Unexpected error submitting survey:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred while submitting the survey",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
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
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            {sections.map((section, index) => (
              <div key={index} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  {index < currentStep ? <Check className="w-4 h-4" /> : section.icon}
                </div>
                {index < sections.length - 1 && (
                  <div className={`w-full h-1 mx-2 ${
                    index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} style={{ width: '40px' }} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {sections.map((section, index) => (
              <span key={index} className={`text-xs ${
                index <= currentStep ? 'text-blue-600 font-medium' : 'text-gray-400'
              }`}>
                {section.title}
              </span>
            ))}
          </div>
        </div>
        
        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Render all sections but only show the current one */}
          <div style={{ display: sections[currentStep]?.component === 'welcome' ? 'block' : 'none' }}>
            <WelcomeSection />
          </div>
          
          <div style={{ display: sections[currentStep]?.component === 'reportDetails' ? 'block' : 'none' }}>
            <ReportDetailsSection />
          </div>
          
          <div style={{ display: sections[currentStep]?.component === 'programHighlights' ? 'block' : 'none' }}>
            <ProgramHighlightsSection />
          </div>
          
          <div style={{ display: sections[currentStep]?.component === 'staffing' ? 'block' : 'none' }}>
            <StaffingSection />
          </div>
          
          <div style={{ display: sections[currentStep]?.component === 'residentData' ? 'block' : 'none' }}>
            <ResidentDataSection />
          </div>
          
          <div style={{ display: sections[currentStep]?.component === 'facility' ? 'block' : 'none' }}>
            <FacilitySection />
          </div>
          
          <div style={{ display: sections[currentStep]?.component === 'additional' ? 'block' : 'none' }}>
            <AdditionalSection />
          </div>
          
          <div style={{ display: sections[currentStep]?.component === 'review' ? 'block' : 'none' }}>
            <ReviewSection />
          </div>
        </div>
        
        {/* All editors rendered once and kept in DOM */}
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          {/* Program Highlights Editors */}
          <TiptapEditor
            key="weekSummary"
            content={formData.weekSummary || ''}
            onChange={(content) => {
              console.log('Week Summary Tiptap onChange:', content);
              handleInputChange('weekSummary', content);
            }}
            placeholder="Share what happened this week..."
          />
          
          <TiptapEditor
            key="events"
            content={formData.events || ''}
            onChange={(content) => {
              console.log('Events Tiptap onChange:', content);
              handleInputChange('events', content);
            }}
            placeholder="List completed events and projects..."
          />
          
          <TiptapEditor
            key="upcomingEvents"
            content={formData.upcomingEvents || ''}
            onChange={(content) => {
              console.log('Upcoming Events Tiptap onChange:', content);
              handleInputChange('upcomingEvents', content);
            }}
            placeholder="Tell us what's coming up..."
          />
          
          <TiptapEditor
            key="accomplishments"
            content={formData.accomplishments || ''}
            onChange={(content) => {
              console.log('Accomplishments Tiptap onChange:', content);
              handleInputChange('accomplishments', content);
            }}
            placeholder="Share your wins..."
          />

          {/* Staffing Editors */}
          <TiptapEditor
            key="meetingDates"
            content={formData.meetingDates || ''}
            onChange={(content) => {
              console.log('Meeting Dates Tiptap onChange:', content);
              handleInputChange('meetingDates', content);
            }}
            placeholder="e.g., Monday 9am, Wednesday 2pm..."
          />
          
          <TiptapEditor
            key="evaluationDetails"
            content={formData.evaluationDetails || ''}
            onChange={(content) => {
              console.log('Evaluation Details Tiptap onChange:', content);
              handleInputChange('evaluationDetails', content);
            }}
            placeholder="Describe the activities..."
          />
          
          <TiptapEditor
            key="staffingNeeds"
            content={formData.staffingNeeds || ''}
            onChange={(content) => {
              console.log('Staffing Needs Tiptap onChange:', content);
              handleInputChange('staffingNeeds', content);
            }}
            placeholder="Share any concerns or needs..."
          />

          {/* Resident Data Editors */}
          <TiptapEditor
            key="phase1NextSteps"
            content={formData.phase1NextSteps || ''}
            onChange={(content) => {
              console.log('Phase1 Next Steps Tiptap onChange:', content);
              handleInputChange('phase1NextSteps', content);
            }}
            placeholder="Enter details..."
          />
          
          <TiptapEditor
            key="phase2NextSteps"
            content={formData.phase2NextSteps || ''}
            onChange={(content) => {
              console.log('Phase2 Next Steps Tiptap onChange:', content);
              handleInputChange('phase2NextSteps', content);
            }}
            placeholder="Enter details..."
          />
          
          <TiptapEditor
            key="dischargeReasons"
            content={formData.dischargeReasons || ''}
            onChange={(content) => {
              console.log('Discharge Reasons Tiptap onChange:', content);
              handleInputChange('dischargeReasons', content);
            }}
            placeholder="Enter details..."
          />

          {/* Facility Editors */}
          <TiptapEditor
            key="facilityIssues"
            content={formData.facilityIssues || ''}
            onChange={(content) => {
              console.log('Facility Issues Tiptap onChange:', content);
              handleInputChange('facilityIssues', content);
            }}
            placeholder="Describe any maintenance or facility concerns..."
          />
          
          <TiptapEditor
            key="supplyNeeds"
            content={formData.supplyNeeds || ''}
            onChange={(content) => {
              console.log('Supply Needs Tiptap onChange:', content);
              handleInputChange('supplyNeeds', content);
            }}
            placeholder="List needed supplies or equipment..."
          />
          
          <TiptapEditor
            key="programConcerns"
            content={formData.programConcerns || ''}
            onChange={(content) => {
              console.log('Program Concerns Tiptap onChange:', content);
              handleInputChange('programConcerns', content);
            }}
            placeholder="Share any program-related concerns..."
          />

          {/* Additional Editors */}
          <TiptapEditor
            key="celebrations"
            content={formData.celebrations || ''}
            onChange={(content) => {
              console.log('Celebrations Tiptap onChange:', content);
              handleInputChange('celebrations', content);
            }}
            placeholder="Tell us about the good stuff..."
          />
          
          <TiptapEditor
            key="additionalComments"
            content={formData.additionalComments || ''}
            onChange={(content) => {
              console.log('Additional Comments Tiptap onChange:', content);
              handleInputChange('additionalComments', content);
            }}
            placeholder="Anything else you'd like to share..."
          />
        </div>
      </div>
    </div>
  );
};

export default RecoveryPointSurvey;
