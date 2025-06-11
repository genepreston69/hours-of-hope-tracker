
import React, { useState } from 'react';
import { TiptapEditor } from '@/components/ui/tiptap-editor';
import { SectionProps } from './types';

export const AdditionalSection: React.FC<SectionProps> = ({ 
  formData, 
  handleInputChange, 
  nextStep, 
  prevStep 
}) => {
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
          key={`${currentQuestion.field}-${subStep}`}
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
};
