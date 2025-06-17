
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { IncidentFormData } from './useIncidentForm';

interface DocumentationSectionProps {
  formData: IncidentFormData;
  handleInputChange: (field: string, value: any) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const DocumentationSection = ({ 
  formData, 
  handleInputChange, 
  nextStep, 
  prevStep 
}: DocumentationSectionProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Documentation & Follow-up</h2>
        <p className="text-gray-600">Record documentation and required follow-up actions.</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="photosTaken"
            checked={formData.photosTaken}
            onCheckedChange={(checked) => handleInputChange('photosTaken', checked)}
          />
          <Label htmlFor="photosTaken">Photos were taken of the incident scene</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="evidenceCollected"
            checked={formData.evidenceCollected}
            onCheckedChange={(checked) => handleInputChange('evidenceCollected', checked)}
          />
          <Label htmlFor="evidenceCollected">Physical evidence was collected</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="regulatoryReportingRequired"
            checked={formData.regulatoryReportingRequired}
            onCheckedChange={(checked) => handleInputChange('regulatoryReportingRequired', checked)}
          />
          <Label htmlFor="regulatoryReportingRequired">Regulatory reporting is required</Label>
        </div>

        {formData.regulatoryReportingRequired && (
          <div>
            <Label htmlFor="regulatoryAgencies">Regulatory Agencies to Notify</Label>
            <Textarea
              id="regulatoryAgencies"
              value={formData.regulatoryAgencies}
              onChange={(e) => handleInputChange('regulatoryAgencies', e.target.value)}
              placeholder="List the agencies that need to be notified (e.g., Department of Health, OSHA)"
              className="min-h-20"
            />
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="followUpActionsRequired">Follow-up Actions Required</Label>
        <Textarea
          id="followUpActionsRequired"
          value={formData.followUpActionsRequired}
          onChange={(e) => handleInputChange('followUpActionsRequired', e.target.value)}
          placeholder="List any follow-up actions, investigations, or changes needed"
          className="min-h-24"
        />
      </div>

      <div>
        <Label htmlFor="incidentPreventionMeasures">Incident Prevention Measures</Label>
        <Textarea
          id="incidentPreventionMeasures"
          value={formData.incidentPreventionMeasures}
          onChange={(e) => handleInputChange('incidentPreventionMeasures', e.target.value)}
          placeholder="Describe measures that could prevent similar incidents in the future"
          className="min-h-24"
        />
      </div>

      <div>
        <Label htmlFor="additionalDocumentation">Additional Documentation</Label>
        <Textarea
          id="additionalDocumentation"
          value={formData.additionalDocumentation}
          onChange={(e) => handleInputChange('additionalDocumentation', e.target.value)}
          placeholder="Any additional notes, observations, or documentation details"
          className="min-h-24"
        />
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep} className="bg-red-600 hover:bg-red-700">
          Continue
        </Button>
      </div>
    </div>
  );
};
