
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { IncidentFormData } from './useIncidentForm';

interface IncidentDetailsSectionProps {
  formData: IncidentFormData;
  handleInputChange: (field: string, value: any) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const IncidentDetailsSection = ({ 
  formData, 
  handleInputChange, 
  nextStep, 
  prevStep 
}: IncidentDetailsSectionProps) => {
  const canProceed = formData.incidentDescription.trim().length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Incident Details</h2>
        <p className="text-gray-600">Provide a detailed description of what happened.</p>
      </div>

      <div>
        <Label htmlFor="incidentDescription">What happened? *</Label>
        <Textarea
          id="incidentDescription"
          value={formData.incidentDescription}
          onChange={(e) => handleInputChange('incidentDescription', e.target.value)}
          placeholder="Provide a detailed, objective description of the incident. Include the sequence of events, what you observed, and any immediate circumstances."
          className="min-h-32"
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          Be specific and factual. Avoid speculation or opinions.
        </p>
      </div>

      <div>
        <Label htmlFor="immediateCause">Immediate Cause</Label>
        <Textarea
          id="immediateCause"
          value={formData.immediateCause}
          onChange={(e) => handleInputChange('immediateCause', e.target.value)}
          placeholder="What was the direct cause of this incident? (e.g., wet floor, equipment failure, medical condition)"
          className="min-h-24"
        />
      </div>

      <div>
        <Label htmlFor="contributingFactors">Contributing Factors</Label>
        <Textarea
          id="contributingFactors"
          value={formData.contributingFactors}
          onChange={(e) => handleInputChange('contributingFactors', e.target.value)}
          placeholder="What factors may have contributed to this incident? (e.g., lighting conditions, staffing levels, resident condition, environmental factors)"
          className="min-h-24"
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Writing Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use objective language (what you saw, heard, or observed)</li>
          <li>• Include specific times, locations, and sequence of events</li>
          <li>• Avoid blame, assumptions, or opinions</li>
          <li>• Include relevant environmental conditions</li>
        </ul>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button 
          onClick={nextStep}
          disabled={!canProceed}
          className="bg-red-600 hover:bg-red-700"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
