
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IncidentFormData } from './useIncidentForm';
import { supabase } from '@/integrations/supabase/client';

interface IncidentOverviewSectionProps {
  formData: IncidentFormData;
  handleInputChange: (field: string, value: any) => void;
  nextStep: () => void;
  prevStep: () => void;
}

interface FacilityLocation {
  id: string;
  name: string;
}

export const IncidentOverviewSection = ({ 
  formData, 
  handleInputChange, 
  nextStep, 
  prevStep 
}: IncidentOverviewSectionProps) => {
  const [facilityLocations, setFacilityLocations] = useState<FacilityLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const canProceed = formData.incidentDate && formData.incidentTime && formData.location && 
                    formData.incidentType && formData.severityLevel;

  useEffect(() => {
    const fetchFacilityLocations = async () => {
      try {
        const { data, error } = await supabase
          .from('facility_locations')
          .select('id, name')
          .order('name');

        if (error) {
          console.error('Error fetching facility locations:', error);
          // Use fallback options if database fetch fails
          setFacilityLocations([
            { id: 'rpb', name: 'RPB' },
            { id: 'rpc', name: 'RPC' },
            { id: 'rph', name: 'RPH' },
            { id: 'rpp', name: 'RPP' },
            { id: 'point-apartments', name: 'Point Apartments' },
            { id: 'phase-2-housing', name: 'Phase 2 Housing' }
          ]);
        } else {
          setFacilityLocations(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
        // Use fallback options
        setFacilityLocations([
          { id: 'rpb', name: 'RPB' },
          { id: 'rpc', name: 'RPC' },
          { id: 'rph', name: 'RPH' },
          { id: 'rpp', name: 'RPP' },
          { id: 'point-apartments', name: 'Point Apartments' },
          { id: 'phase-2-housing', name: 'Phase 2 Housing' }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacilityLocations();
  }, []);

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
        <Label htmlFor="facilityLocation">Facility Location *</Label>
        <Select 
          value={formData.location} 
          onValueChange={(value) => handleInputChange('location', value)}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder={isLoading ? "Loading locations..." : "Select facility location"} />
          </SelectTrigger>
          <SelectContent>
            {facilityLocations.map((location) => (
              <SelectItem key={location.id} value={location.name}>
                {location.name}
              </SelectItem>
            ))}
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
