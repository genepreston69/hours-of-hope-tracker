
import React from 'react';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { MeetingEntry } from './useSurveyForm';

interface MeetingFieldsProps {
  meetings: MeetingEntry[];
  onChange: (meetings: MeetingEntry[]) => void;
}

export const MeetingFields: React.FC<MeetingFieldsProps> = ({ meetings, onChange }) => {
  const addMeeting = () => {
    const newMeeting: MeetingEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      time: '',
      name: ''
    };
    onChange([...meetings, newMeeting]);
  };

  const removeMeeting = (id: string) => {
    onChange(meetings.filter(meeting => meeting.id !== id));
  };

  const updateMeeting = (id: string, field: keyof MeetingEntry, value: string) => {
    onChange(meetings.map(meeting => 
      meeting.id === id ? { ...meeting, [field]: value } : meeting
    ));
  };

  const updateMeetingDate = (id: string, date: Date | undefined) => {
    if (date) {
      updateMeeting(id, 'date', date.toISOString().split('T')[0]);
    }
  };

  if (meetings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No meetings added yet</p>
        <Button onClick={addMeeting} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Meeting
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {meetings.map((meeting) => (
        <div key={meeting.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-700">Meeting Entry</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeMeeting(meeting.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Date Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !meeting.date && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {meeting.date ? format(new Date(meeting.date), "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={meeting.date ? new Date(meeting.date) : undefined}
                    onSelect={(date) => updateMeetingDate(meeting.id, date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <Input
                type="time"
                value={meeting.time}
                onChange={(e) => updateMeeting(meeting.id, 'time', e.target.value)}
                placeholder="Select time"
              />
            </div>

            {/* Meeting Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meeting Name
              </label>
              <Input
                type="text"
                value={meeting.name}
                onChange={(e) => updateMeeting(meeting.id, 'name', e.target.value)}
                placeholder="e.g., Staff meeting, Training session"
              />
            </div>
          </div>
        </div>
      ))}
      
      <Button onClick={addMeeting} variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Another Meeting
      </Button>
    </div>
  );
};
