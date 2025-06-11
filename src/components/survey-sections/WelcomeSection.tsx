
import React from 'react';
import { Check } from 'lucide-react';
import { SectionProps } from './types';
import { PhotoUpload } from './PhotoUpload';

export const WelcomeSection: React.FC<SectionProps> = ({ 
  formData, 
  handleInputChange, 
  nextStep 
}) => {
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
      
      <div className="bg-gray-50 rounded-lg p-6">
        <PhotoUpload
          photos={formData.photos}
          onPhotosChange={(photos) => handleInputChange('photos', photos)}
        />
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
};
