
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { IncidentFormData } from './useIncidentForm';

interface ImmediateResponseSectionProps {
  formData: IncidentFormData;
  handleInputChange: (field: string, value: any) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const ImmediateResponseSection = ({ 
  formData, 
  handleInputChange, 
  nextStep, 
  prevStep 
}: ImmediateResponseSectionProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Immediate Response</h2>
        <p className="text-gray-600">Document the immediate actions taken and notifications made.</p>
      </div>

      <div>
        <Label htmlFor="immediateActionsTaken">Immediate Actions Taken</Label>
        <Textarea
          id="immediateActionsTaken"
          value={formData.immediateActionsTaken}
          onChange={(e) => handleInputChange('immediateActionsTaken', e.target.value)}
          placeholder="Describe the immediate steps taken to address the incident and ensure safety"
          className="min-h-32"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="supervisorNotified"
            checked={formData.supervisorNotified}
            onCheckedChange={(checked) => handleInputChange('supervisorNotified', checked)}
          />
          <Label htmlFor="supervisorNotified">Supervisor was notified</Label>
        </div>

        {formData.supervisorNotified && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="supervisorName">Supervisor Name</Label>
              <Input
                id="supervisorName"
                value={formData.supervisorName}
                onChange={(e) => handleInputChange('supervisorName', e.target.value)}
                placeholder="Name of supervisor notified"
              />
            </div>
            <div>
              <Label htmlFor="supervisorNotificationTime">Notification Time</Label>
              <Input
                id="supervisorNotificationTime"
                type="datetime-local"
                value={formData.supervisorNotificationTime}
                onChange={(e) => handleInputChange('supervisorNotificationTime', e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            id="familyNotified"
            checked={formData.familyNotified}
            onCheckedChange={(checked) => handleInputChange('familyNotified', checked)}
          />
          <Label htmlFor="familyNotified">Family/emergency contact was notified</Label>
        </div>

        {formData.familyNotified && (
          <div>
            <Label htmlFor="familyNotificationDetails">Family Notification Details</Label>
            <Textarea
              id="familyNotificationDetails"
              value={formData.familyNotificationDetails}
              onChange={(e) => handleInputChange('familyNotificationDetails', e.target.value)}
              placeholder="Who was contacted, when, and their response"
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
