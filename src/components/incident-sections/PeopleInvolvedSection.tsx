
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Users } from 'lucide-react';
import { IncidentFormData, PersonInvolved } from './useIncidentForm';

interface PeopleInvolvedSectionProps {
  formData: IncidentFormData;
  handleInputChange: (field: string, value: any) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const PeopleInvolvedSection = ({ 
  formData, 
  handleInputChange, 
  nextStep, 
  prevStep 
}: PeopleInvolvedSectionProps) => {
  const addPerson = (category: 'residentsInvolved' | 'staffInvolved' | 'visitorsInvolved' | 'witnesses') => {
    const newPerson: PersonInvolved = {
      id: Date.now().toString(),
      name: '',
      role: '',
      contactInfo: '',
      statement: ''
    };
    
    const currentList = formData[category];
    handleInputChange(category, [...currentList, newPerson]);
  };

  const removePerson = (category: 'residentsInvolved' | 'staffInvolved' | 'visitorsInvolved' | 'witnesses', personId: string) => {
    const currentList = formData[category];
    const updatedList = currentList.filter(person => person.id !== personId);
    handleInputChange(category, updatedList);
  };

  const updatePerson = (category: 'residentsInvolved' | 'staffInvolved' | 'visitorsInvolved' | 'witnesses', personId: string, field: string, value: string) => {
    const currentList = formData[category];
    const updatedList = currentList.map(person => 
      person.id === personId ? { ...person, [field]: value } : person
    );
    handleInputChange(category, updatedList);
  };

  const PersonCard = ({ 
    person, 
    category, 
    title 
  }: { 
    person: PersonInvolved; 
    category: 'residentsInvolved' | 'staffInvolved' | 'visitorsInvolved' | 'witnesses';
    title: string;
  }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removePerson(category, person.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Name</Label>
            <Input
              value={person.name}
              onChange={(e) => updatePerson(category, person.id, 'name', e.target.value)}
              placeholder="Full name"
            />
          </div>
          <div>
            <Label className="text-xs">Role/Relationship</Label>
            <Input
              value={person.role}
              onChange={(e) => updatePerson(category, person.id, 'role', e.target.value)}
              placeholder="Position, family member, etc."
            />
          </div>
        </div>
        <div>
          <Label className="text-xs">Contact Information</Label>
          <Input
            value={person.contactInfo}
            onChange={(e) => updatePerson(category, person.id, 'contactInfo', e.target.value)}
            placeholder="Phone number, room number, etc."
          />
        </div>
        <div>
          <Label className="text-xs">Statement/Notes</Label>
          <Textarea
            value={person.statement}
            onChange={(e) => updatePerson(category, person.id, 'statement', e.target.value)}
            placeholder="What they said or observed"
            className="min-h-20"
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">People Involved</h2>
        <p className="text-gray-600">Document everyone who was involved in or witnessed the incident.</p>
      </div>

      {/* Residents */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Residents Involved
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addPerson('residentsInvolved')}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Resident
          </Button>
        </div>
        {formData.residentsInvolved.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No residents added yet</p>
        ) : (
          formData.residentsInvolved.map((person) => (
            <PersonCard 
              key={person.id} 
              person={person} 
              category="residentsInvolved" 
              title="Resident"
            />
          ))
        )}
      </div>

      {/* Staff */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Staff Involved</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addPerson('staffInvolved')}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Staff
          </Button>
        </div>
        {formData.staffInvolved.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No staff added yet</p>
        ) : (
          formData.staffInvolved.map((person) => (
            <PersonCard 
              key={person.id} 
              person={person} 
              category="staffInvolved" 
              title="Staff Member"
            />
          ))
        )}
      </div>

      {/* Visitors */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Visitors Involved</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addPerson('visitorsInvolved')}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Visitor
          </Button>
        </div>
        {formData.visitorsInvolved.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No visitors added yet</p>
        ) : (
          formData.visitorsInvolved.map((person) => (
            <PersonCard 
              key={person.id} 
              person={person} 
              category="visitorsInvolved" 
              title="Visitor"
            />
          ))
        )}
      </div>

      {/* Witnesses */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Witnesses</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addPerson('witnesses')}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Witness
          </Button>
        </div>
        {formData.witnesses.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No witnesses added yet</p>
        ) : (
          formData.witnesses.map((person) => (
            <PersonCard 
              key={person.id} 
              person={person} 
              category="witnesses" 
              title="Witness"
            />
          ))
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
