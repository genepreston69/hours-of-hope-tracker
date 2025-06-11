
import React, { useState } from 'react';
import { TiptapEditor } from '@/components/ui/tiptap-editor';
import { SectionProps } from './types';

export const ProgramHighlightsSection: React.FC<SectionProps> = ({ 
  formData, 
  handleInputChange, 
  nextStep, 
  prevStep 
}) => {
  const [subStep, setSubStep] = useState(0);
  
  const questions = [
    {
      field: 'weekSummary',
      label: 'How would you summarize this week at your program?',
      type: 'textarea',
      placeholder: 'Provide a brief overview of the week...'
    },
    {
      field: 'events',
      label: 'What events or volunteer projects did you complete?',
      type: 'textarea',
      placeholder: 'Describe any events, activities, or volunteer work...'
    },
    {
      field: 'upcomingEvents',
      label: 'Any upcoming events to highlight?',
      type: 'textarea',
      placeholder: 'Share information about future events or activities...'
    },
    {
      field: 'accomplishments',
      label: 'What accomplishments would you like to share?',
      type: 'textarea',
      placeholder: 'Highlight any achievements, milestones, or positive outcomes...'
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
            console.log('Program Highlights Tiptap onChange:', currentQuestion.field, content);
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
