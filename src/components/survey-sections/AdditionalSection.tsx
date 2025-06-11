
import React from 'react';
import { SectionProps } from './types';
import { PhotoUpload } from './PhotoUpload';

export const AdditionalSection: React.FC<SectionProps> = ({ 
  formData, 
  handleInputChange, 
  nextStep, 
  prevStep 
}) => {
  const questions = [
    {
      id: 'celebrations',
      label: 'What successes or positive developments would you like to celebrate this week?',
      type: 'textarea' as const,
      placeholder: 'Share any positive news, achievements, or celebrations...'
    },
    {
      id: 'additionalComments',
      label: 'Additional Comments or Concerns',
      type: 'textarea' as const,
      placeholder: 'Any other information you would like to share...'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Additional Information</h2>
      
      <div className="space-y-6">
        {questions.map((question) => (
          <div key={question.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {question.label}
            </label>
            <textarea
              value={formData[question.id as keyof typeof formData] as string}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              placeholder={question.placeholder}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
        
        <PhotoUpload
          photos={formData.photos}
          onPhotosChange={(photos) => handleInputChange('photos', photos)}
        />
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="text-gray-600 hover:text-gray-800"
        >
          ← Previous Section
        </button>
        <button
          onClick={nextStep}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue to Review →
        </button>
      </div>
    </div>
  );
};
