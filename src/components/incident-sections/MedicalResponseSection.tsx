
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { IncidentFormData } from './useIncidentForm';

interface MedicalResponseSectionProps {
  formData: IncidentFormData;
  handleInputChange: (field: string, value: any) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const MedicalResponseSection = ({ 
  formData, 
  handleInputChange, 
  nextStep, 
  prevStep 
}: MedicalResponseSectionProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Medical Response</h2>
        <p className="text-gray-600">Document any injuries and medical care provided.</p>
      </div>

      <div>
        <Label htmlFor="injuriesSustained">Injuries Sustained</Label>
        <Textarea
          id="injuriesSustained"
          value={formData.injuriesSustained}
          onChange={(e) => handleInputChange('injuriesSustained', e.target.value)}
          placeholder="Describe any injuries in detail, including location and severity"
          className="min-h-24"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="medicalTreatmentProvided"
            checked={formData.medicalTreatmentProvided}
            onCheckedChange={(checked) => handleInputChange('medicalTreatmentProvided', checked)}
          />
          <Label htmlFor="medicalTreatmentProvided">Medical treatment was provided</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="medicalProfessionalContacted"
            checked={formData.medicalProfessionalContacted}
            onCheckedChange={(checked) => handleInputChange('medicalProfessionalContacted', checked)}
          />
          <Label htmlFor="medicalProfessionalContacted">Medical professional was contacted</Label>
        </div>

        {formData.medicalProfessionalContacted && (
          <div>
            <Label htmlFor="medicalProfessionalDetails">Medical Professional Details</Label>
            <Textarea
              id="medicalProfessionalDetails"
              value={formData.medicalProfessionalDetails}
              onChange={(e) => handleInputChange('medicalProfessionalDetails', e.target.value)}
              placeholder="Name, contact information, and details of medical professional contacted"
              className="min-h-20"
            />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            id="hospitalTransportRequired"
            checked={formData.hospitalTransportRequired}
            onCheckedChange={(checked) => handleInputChange('hospitalTransportRequired', checked)}
          />
          <Label htmlFor="hospitalTransportRequired">Hospital transport was required</Label>
        </div>

        {formData.hospitalTransportRequired && (
          <div>
            <Label htmlFor="hospitalDetails">Hospital Details</Label>
            <Textarea
              id="hospitalDetails"
              value={formData.hospitalDetails}
              onChange={(e) => handleInputChange('hospitalDetails', e.target.value)}
              placeholder="Hospital name, transport method, and outcome"
              className="min-h-20"
            />
          </div>
        )}
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
