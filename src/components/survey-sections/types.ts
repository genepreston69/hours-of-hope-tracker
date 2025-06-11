
import { FormData, MeetingEntry } from './useSurveyForm';

export interface SectionProps {
  formData: FormData;
  handleInputChange: (field: string, value: string | MeetingEntry[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  isSubmitting?: boolean;
  setIsSubmitting?: (submitting: boolean) => void;
  navigate?: any;
  user?: any;
}
