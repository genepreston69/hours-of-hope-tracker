
import React, { useState } from 'react';
import { TiptapEditor } from '@/components/ui/tiptap-editor';
import { SectionProps } from './types';

export const FacilitySection: React.FC<SectionProps> = ({ 
  formData, 
  handleInputChange, 
  nextStep, 
  prevStep 
}) => {
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
};
