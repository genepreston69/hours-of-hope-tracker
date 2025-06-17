
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { TiptapEditor } from '@/components/ui/tiptap-editor';
import { SectionProps } from './types';
import { QuestionPhotoUpload } from './QuestionPhotoUpload';

interface ResidentDataItem {
  field: string;
  label: string;
  type: string;
  note?: string;
  allowPhotos?: boolean;
  showIf?: (data: any) => boolean;
}

interface ResidentDataGroup {
  group: string;
  items: ResidentDataItem[];
}

export const ResidentDataSection: React.FC<SectionProps> = ({ 
  formData, 
  handleInputChange, 
  handleQuestionPhotosChange,
  nextStep, 
  prevStep 
}) => {
  const [subStep, setSubStep] = useState(0);
  
  const questions: ResidentDataGroup[] = [
    {
      group: 'Current Residents',
      items: [
        { field: 'otsCount', label: 'How many residents are currently in OTS?', type: 'number' },
        { field: 'phase1Count', label: 'How many residents are currently in Phase 1?', type: 'number' },
        { field: 'phase2Count', label: 'How many residents are currently in Phase 2?', type: 'number' }
      ]
    },
    {
      group: 'Phase Completions',
      items: [
        { field: 'phase1Completions', label: 'Number of Phase 1 completions this week?', type: 'number', note: 'Attach photos to celebrate achievements', allowPhotos: true },
        { field: 'phase1NextSteps', label: 'Who completed Phase 1 and what are their next steps?', type: 'textarea', showIf: (data) => data.phase1Completions > 0 }
      ]
    },
    {
      group: 'Phase 2 Completions',
      items: [
        { field: 'phase2Completions', label: 'Number of Phase 2 completions this week?', type: 'number', note: 'Attach photos to celebrate achievements', allowPhotos: true },
        { field: 'phase2NextSteps', label: 'Who completed Phase 2 and what will they be doing now?', type: 'textarea', showIf: (data) => data.phase2Completions > 0 }
      ]
    },
    {
      group: 'Education & Life Skills',
      items: [
        { field: 'gedPreparationStarts', label: 'How many GED preparation starts?', type: 'number' },
        { field: 'gedCompletions', label: 'How many GED completions?', type: 'number' },
        { field: 'lifeSkillsStarts', label: 'How many started Life Skills Training?', type: 'number' },
        { field: 'driversLicenseReceived', label: 'How many received their drivers license?', type: 'number' }
      ]
    },
    {
      group: 'Program Participation',
      items: [
        { field: 'peerMentors', label: 'Current number of peer mentors?', type: 'number' },
        { field: 'matClients', label: 'Number of MAT clients currently enrolled?', type: 'number' }
      ]
    },
    {
      group: 'Weekly Intakes',
      items: [
        { field: 'totalIntakes', label: 'Total number of intakes this week?', type: 'number' },
        { field: 'matIntakes', label: 'Number of MAT intakes this week?', type: 'number' },
        { field: 'courtIntakes', label: 'Number of court-ordered intakes this week?', type: 'number' },
        { field: 'scheduledIntakes', label: 'Number of intakes scheduled for next 7 days?', type: 'number' },
        { field: 'ots1Orientations', label: 'Number of residents oriented into OTS 1 this week?', type: 'number' }
      ]
    },
    {
      group: 'Discharges & Screens',
      items: [
        { field: 'discharges', label: 'Number of discharges this week?', type: 'number' },
        { field: 'dischargeReasons', label: 'What were the reasons for discharge?', type: 'textarea', showIf: (data) => data.discharges > 0 },
        { field: 'drugScreens', label: 'Number of confirmed positive drug screens this week?', type: 'number' }
      ]
    }
  ];
  
  const currentGroup = questions[subStep];
  const visibleItems = currentGroup.items.filter(item => !item.showIf || item.showIf(formData));
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{currentGroup.group}</h2>
        <div className="mt-1 h-2 bg-gray-200 rounded-full">
          <div 
            className="h-2 bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${((subStep + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        {visibleItems.map((item) => (
          <div key={item.field}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {item.label}
              {item.note && <span className="text-gray-500 text-sm ml-2">({item.note})</span>}
            </label>
            
            {item.type === 'number' && (
              <Input
                type="number"
                value={formData[item.field as keyof typeof formData] as string || ''}
                onChange={(e) => handleInputChange(item.field, e.target.value)}
                placeholder="Enter number"
              />
            )}
            
            {item.type === 'textarea' && (
              <TiptapEditor
                fieldName={item.field}
                content={formData[item.field as keyof typeof formData] as string || ''}
                onChange={(content) => {
                  console.log('Resident Data Tiptap onChange:', item.field, content);
                  handleInputChange(item.field, content);
                }}
                placeholder="Enter details..."
              />
            )}
            
            {item.allowPhotos && handleQuestionPhotosChange && (
              <QuestionPhotoUpload
                questionField={item.field}
                photos={formData.questionPhotos[item.field] || []}
                onPhotosChange={(photos) => handleQuestionPhotosChange(item.field, photos)}
                label="Attach completion photos"
              />
            )}
          </div>
        ))}
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={() => subStep > 0 ? setSubStep(subStep - 1) : prevStep()}
          className="text-gray-600 hover:text-gray-800"
        >
          ← Back
        </button>
        <button
          onClick={() => subStep < questions.length - 1 ? setSubStep(subStep + 1) : nextStep()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
