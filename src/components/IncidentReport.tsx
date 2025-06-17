
import React, { useState } from 'react';
import { Check, AlertTriangle, Users, FileText, Camera, Heart, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { WelcomeSection } from './incident-sections/WelcomeSection';
import { IncidentOverviewSection } from './incident-sections/IncidentOverviewSection';
import { IncidentDetailsSection } from './incident-sections/IncidentDetailsSection';
import { PeopleInvolvedSection } from './incident-sections/PeopleInvolvedSection';
import { MedicalResponseSection } from './incident-sections/MedicalResponseSection';
import { ImmediateResponseSection } from './incident-sections/ImmediateResponseSection';
import { DocumentationSection } from './incident-sections/DocumentationSection';
import { ReviewSubmitSection } from './incident-sections/ReviewSubmitSection';
import { useIncidentForm } from './incident-sections/useIncidentForm';

const IncidentReport = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { formData, handleInputChange, autoSave } = useIncidentForm(user);

  const sections = [
    {
      title: "Welcome",
      icon: <Shield className="w-5 h-5" />,
      component: "welcome"
    },
    {
      title: "Incident Overview",
      icon: <AlertTriangle className="w-5 h-5" />,
      component: "overview"
    },
    {
      title: "Incident Details",
      icon: <FileText className="w-5 h-5" />,
      component: "details"
    },
    {
      title: "People Involved",
      icon: <Users className="w-5 h-5" />,
      component: "people"
    },
    {
      title: "Medical Response",
      icon: <Heart className="w-5 h-5" />,
      component: "medical"
    },
    {
      title: "Immediate Response",
      icon: <Shield className="w-5 h-5" />,
      component: "response"
    },
    {
      title: "Documentation",
      icon: <Camera className="w-5 h-5" />,
      component: "documentation"
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
      autoSave();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      autoSave();
    }
  };

  const sectionProps = {
    formData,
    handleInputChange,
    nextStep,
    prevStep,
    isSubmitting,
    setIsSubmitting,
    navigate,
    user,
    autoSave
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            {sections.map((section, index) => (
              <div key={index} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  index <= currentStep ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  {index < currentStep ? <Check className="w-4 h-4" /> : section.icon}
                </div>
                {index < sections.length - 1 && (
                  <div className={`w-full h-1 mx-2 ${
                    index < currentStep ? 'bg-red-600' : 'bg-gray-200'
                  }`} style={{ width: '40px' }} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {sections.map((section, index) => (
              <span key={index} className={`text-xs ${
                index <= currentStep ? 'text-red-600 font-medium' : 'text-gray-400'
              }`}>
                {section.title}
              </span>
            ))}
          </div>
        </div>
        
        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {sections[currentStep]?.component === 'welcome' && <WelcomeSection {...sectionProps} />}
          {sections[currentStep]?.component === 'overview' && <IncidentOverviewSection {...sectionProps} />}
          {sections[currentStep]?.component === 'details' && <IncidentDetailsSection {...sectionProps} />}
          {sections[currentStep]?.component === 'people' && <PeopleInvolvedSection {...sectionProps} />}
          {sections[currentStep]?.component === 'medical' && <MedicalResponseSection {...sectionProps} />}
          {sections[currentStep]?.component === 'response' && <ImmediateResponseSection {...sectionProps} />}
          {sections[currentStep]?.component === 'documentation' && <DocumentationSection {...sectionProps} />}
          {sections[currentStep]?.component === 'review' && <ReviewSubmitSection {...sectionProps} />}
        </div>
      </div>
    </div>
  );
};

export default IncidentReport;
