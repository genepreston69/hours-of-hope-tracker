
import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { SectionProps } from './types';
import { supabase } from '@/integrations/supabase/client';

interface FacilityLocation {
  id: string;
  name: string;
}

export const ReportDetailsSection: React.FC<SectionProps> = ({ 
  formData, 
  handleInputChange, 
  nextStep 
}) => {
  console.log('ReportDetailsSection mounting');
  const [facilityLocations, setFacilityLocations] = useState<FacilityLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
            { id: 'point-apartments', name: 'Point Apartments' }
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
          { id: 'point-apartments', name: 'Point Apartments' }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacilityLocations();
  }, []);
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">First, let's get some basic information</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Which program/facility is this report for? *
          </label>
          <Select 
            value={formData.programName} 
            onValueChange={(value) => handleInputChange('programName', value)}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={isLoading ? "Loading facilities..." : "Select a program/facility"} />
            </SelectTrigger>
            <SelectContent>
              {facilityLocations.map((facility) => (
                <SelectItem key={facility.id} value={facility.name}>
                  {facility.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What date are you submitting this report? *
          </label>
          <Input
            type="date"
            value={formData.reportDate}
            onChange={(e) => handleInputChange('reportDate', e.target.value)}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your name *
          </label>
          <Input
            type="text"
            value={formData.reporterName}
            onChange={(e) => handleInputChange('reporterName', e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={nextStep}
          disabled={!formData.programName || !formData.reportDate || !formData.reporterName}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
