import React, { useState, useEffect } from 'react';
import { Check, Users, Home, FileText, MessageSquare } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { WelcomeSection } from './survey-sections/WelcomeSection';
import { ReportDetailsSection } from './survey-sections/ReportDetailsSection';
import { ProgramHighlightsSection } from './survey-sections/ProgramHighlightsSection';
import { StaffingSection } from './survey-sections/StaffingSection';
import { ResidentDataSection } from './survey-sections/ResidentDataSection';
import { FacilitySection } from './survey-sections/FacilitySection';
import { AdditionalSection } from './survey-sections/AdditionalSection';
import { ReviewSection } from './survey-sections/ReviewSection';
import { useSurveyForm } from './survey-sections/useSurveyForm';

const RecoveryPointSurvey = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  console.log('🔸 RecoveryPointSurvey render, currentStep:', currentStep);
  
  const { formData, handleInputChange, handleQuestionPhotosChange } = useSurveyForm(user);

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

  const sectionProps = {
    formData,
    handleInputChange,
    handleQuestionPhotosChange,
    nextStep,
    prevStep,
    isSubmitting,
    setIsSubmitting,
    navigate,
    user
  };

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
          {sections[currentStep]?.component === 'welcome' && <WelcomeSection {...sectionProps} />}
          {sections[currentStep]?.component === 'reportDetails' && <ReportDetailsSection {...sectionProps} />}
          {sections[currentStep]?.component === 'programHighlights' && <ProgramHighlightsSection {...sectionProps} />}
          {sections[currentStep]?.component === 'staffing' && <StaffingSection {...sectionProps} />}
          {sections[currentStep]?.component === 'residentData' && <ResidentDataSection {...sectionProps} />}
          {sections[currentStep]?.component === 'facility' && <FacilitySection {...sectionProps} />}
          {sections[currentStep]?.component === 'additional' && <AdditionalSection {...sectionProps} />}
          {sections[currentStep]?.component === 'review' && <ReviewSection {...sectionProps} />}
        </div>
      </div>
    </div>
  );
};

export default RecoveryPointSurvey;
