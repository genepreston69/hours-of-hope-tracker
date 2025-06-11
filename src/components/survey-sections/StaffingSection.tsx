
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { TiptapEditor } from '@/components/ui/tiptap-editor';
import { SectionProps } from './types';
import { MeetingFields } from './MeetingFields';
import { MeetingEntry } from './useSurveyForm';

interface StaffingQuestion {
  field: string;
  label: string;
  type: string;
  placeholder?: string;
  sublabel?: string;
  options?: string[];
  showIf?: (data: any) => boolean;
}

export const StaffingSection: React.FC<SectionProps> = ({ 
  formData, 
  handleInputChange, 
  nextStep, 
  prevStep 
}) => {
  const [subStep, setSubStep] = useState(0);
  
  const questions: StaffingQuestion[] = [
    {
      field: 'staffMeetings',
      label: 'How many staff meetings did you hold this week?',
      type: 'number',
      placeholder: 'Enter number'
    },
    {
      field: 'meetingEntries',
      label: 'When were these meetings?',
      sublabel: 'Add date, time, and meeting name for each meeting',
      type: 'meeting-fields'
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
        
        {currentQuestion.type === 'meeting-fields' && (
          <MeetingFields
            meetings={formData.meetingEntries}
            onChange={(meetings: MeetingEntry[]) => handleInputChange('meetingEntries', meetings)}
          />
        )}
        
        {currentQuestion.type === 'textarea' && (
          <TiptapEditor
            key={`${currentQuestion.field}-${subStep}`}
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
};
