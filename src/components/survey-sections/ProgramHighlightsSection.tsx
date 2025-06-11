
import React, { useState } from 'react';
import { TiptapEditor } from '@/components/ui/tiptap-editor';
import { SectionProps } from './types';

export const ProgramHighlightsSection: React.FC<SectionProps> = ({ 
  formData, 
  handleInputChange, 
  nextStep, 
  prevStep 
}) => {
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
      sublabel: 'Include dates and details',
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
            key={`${currentQuestion.field}-${subStep}`}
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
};
