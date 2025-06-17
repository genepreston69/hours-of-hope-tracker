
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TiptapEditor } from '@/components/ui/tiptap-editor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { PersonInvolved } from './useIncidentForm';

interface PersonCardProps {
  person: PersonInvolved;
  category: 'residentsInvolved' | 'staffInvolved' | 'visitorsInvolved' | 'witnesses';
  title: string;
  onRemove: (category: string, personId: string) => void;
  onUpdate: (category: string, personId: string, field: string, value: string) => void;
}

export const PersonCard = React.memo(({ 
  person, 
  category, 
  title,
  onRemove,
  onUpdate
}: PersonCardProps) => {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(category, person.id)}
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
              onChange={(e) => onUpdate(category, person.id, 'name', e.target.value)}
              placeholder="Full name"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
          </div>
          <div>
            <Label className="text-xs">Role/Relationship</Label>
            <Input
              value={person.role}
              onChange={(e) => onUpdate(category, person.id, 'role', e.target.value)}
              placeholder="Position, family member, etc."
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
          </div>
        </div>
        <div>
          <Label className="text-xs">Contact Information</Label>
          <Input
            value={person.contactInfo}
            onChange={(e) => onUpdate(category, person.id, 'contactInfo', e.target.value)}
            placeholder="Phone number, room number, etc."
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>
        <div>
          <Label className="text-xs">Statement/Notes</Label>
          <TiptapEditor
            content={person.statement || ''}
            onChange={(content) => onUpdate(category, person.id, 'statement', content)}
            placeholder="What they said or observed"
            fieldName={`${category}-${person.id}-statement`}
          />
        </div>
      </CardContent>
    </Card>
  );
}, (prevProps, nextProps) => {
  // Only re-render if the person data actually changed
  return (
    prevProps.person.id === nextProps.person.id &&
    prevProps.person.name === nextProps.person.name &&
    prevProps.person.role === nextProps.person.role &&
    prevProps.person.contactInfo === nextProps.person.contactInfo &&
    prevProps.person.statement === nextProps.person.statement &&
    prevProps.category === nextProps.category &&
    prevProps.title === nextProps.title
  );
});

PersonCard.displayName = 'PersonCard';
