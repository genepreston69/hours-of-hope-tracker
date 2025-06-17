
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, Clock } from 'lucide-react';

interface WelcomeSectionProps {
  nextStep: () => void;
}

export const WelcomeSection = ({ nextStep }: WelcomeSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <Shield className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Incident Report</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          This secure reporting system will guide you through documenting an incident step-by-step.
          Your report helps ensure resident safety and meets regulatory requirements.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 my-8">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <h3 className="font-semibold text-gray-900">Quick Process</h3>
          <p className="text-sm text-gray-600">Typically completed in 10-15 minutes</p>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <h3 className="font-semibold text-gray-900">Auto-Save</h3>
          <p className="text-sm text-gray-600">Your progress is automatically saved</p>
        </div>
        
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <AlertTriangle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <h3 className="font-semibold text-gray-900">Comprehensive</h3>
          <p className="text-sm text-gray-600">Captures all necessary details</p>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
          <div>
            <h4 className="font-medium text-yellow-800">Important Reminders</h4>
            <ul className="text-sm text-yellow-700 mt-1 space-y-1">
              <li>• Report incidents as soon as possible while details are fresh</li>
              <li>• Be objective and factual in your descriptions</li>
              <li>• Include all relevant parties and witnesses</li>
              <li>• Notify supervisors immediately for serious incidents</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={nextStep} className="bg-red-600 hover:bg-red-700">
          Begin Report
        </Button>
      </div>
    </div>
  );
};
