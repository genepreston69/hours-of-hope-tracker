
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
  const canProceed = formData.incidentDescription && formData.immediateCause;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Incident Details</h2>
        <p className="text-gray-600">Provide a detailed description of what happened.</p>
      </div>

      <div>
        <Label htmlFor="incidentDescription">Incident Description *</Label>
        <Textarea
          id="incidentDescription"
          placeholder="Describe what happened in detail..."
          value={formData.incidentDescription}
          onChange={(e) => handleInputChange('incidentDescription', e.target.value)}
          className="min-h-[120px]"
          required
        />
      </div>

      <div>
        <Label htmlFor="immediateCause">Immediate Cause *</Label>
        <Textarea
          id="immediateCause"
          placeholder="What was the immediate cause of this incident?"
          value={formData.immediateCause}
          onChange={(e) => handleInputChange('immediateCause', e.target.value)}
          className="min-h-[100px]"
          required
        />
      </div>

      <div>
        <Label htmlFor="contributingFactors">Contributing Factors</Label>
        <Textarea
          id="contributingFactors"
          placeholder="Were there any contributing factors? (optional)"
          value={formData.contributingFactors}
          onChange={(e) => handleInputChange('contributingFactors', e.target.value)}
          className="min-h-[100px]"
        />
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
