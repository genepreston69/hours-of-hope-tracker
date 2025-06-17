
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IncidentFormData } from './useIncidentForm';

interface IncidentOverviewSectionProps {
  formData: IncidentFormData;
  handleInputChange: (field: string, value: any) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const IncidentOverviewSection = ({ 
  formData, 
  handleInputChange, 
  nextStep, 
  prevStep 
}: IncidentOverviewSectionProps) => {
  const canProceed = formData.incidentDate && formData.incidentTime && formData.location && 
                    formData.incidentType && formData.severityLevel;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Incident Overview</h2>
        <p className="text-gray-600">Basic details about when and where the incident occurred.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="incidentDate">Incident Date *</Label>
          <Input
            id="incidentDate"
            type="date"
            value={formData.incidentDate}
            onChange={(e) => handleInputChange('incidentDate', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="incidentTime">Incident Time *</Label>
          <Input
            id="incidentTime"
            type="time"
            value={formData.incidentTime}
            onChange={(e) => handleInputChange('incidentTime', e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location *</Label>
        <Select 
          value={formData.location} 
          onValueChange={(value) => handleInputChange('location', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select incident location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="resident-room">Resident Room</SelectItem>
            <SelectItem value="common-area">Common Area</SelectItem>
            <SelectItem value="dining-room">Dining Room</SelectItem>
            <SelectItem value="bathroom">Bathroom</SelectItem>
            <SelectItem value="hallway">Hallway</SelectItem>
            <SelectItem value="kitchen">Kitchen</SelectItem>
            <SelectItem value="outdoor-area">Outdoor Area</SelectItem>
            <SelectItem value="entrance">Entrance/Exit</SelectItem>
            <SelectItem value="parking-lot">Parking Lot</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="incidentType">Incident Type *</Label>
        <Select 
          value={formData.incidentType} 
          onValueChange={(value) => handleInputChange('incidentType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select incident type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fall">Fall</SelectItem>
            <SelectItem value="medication-error">Medication Error</SelectItem>
            <SelectItem value="behavioral-incident">Behavioral Incident</SelectItem>
            <SelectItem value="injury">Injury</SelectItem>
            <SelectItem value="medical-emergency">Medical Emergency</SelectItem>
            <SelectItem value="equipment-malfunction">Equipment Malfunction</SelectItem>
            <SelectItem value="security-breach">Security Breach</SelectItem>
            <SelectItem value="property-damage">Property Damage</SelectItem>
            <SelectItem value="missing-person">Missing Person</SelectItem>
            <SelectItem value="visitor-incident">Visitor Incident</SelectItem>
            <SelectItem value="staff-injury">Staff Injury</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="severityLevel">Severity Level *</Label>
        <Select 
          value={formData.severityLevel} 
          onValueChange={(value) => handleInputChange('severityLevel', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select severity level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="minor">Minor - No injury or minimal impact</SelectItem>
            <SelectItem value="moderate">Moderate - Minor injury or temporary impact</SelectItem>
            <SelectItem value="major">Major - Significant injury or lasting impact</SelectItem>
            <SelectItem value="critical">Critical - Life-threatening or severe injury</SelectItem>
          </SelectContent>
        </Select>
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
