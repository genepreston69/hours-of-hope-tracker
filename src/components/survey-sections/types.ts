
import { FormData, MeetingEntry, QuestionPhotos } from './useSurveyForm';

export interface SectionProps {
  formData: FormData;
  handleInputChange: (field: string, value: string | MeetingEntry[] | File[] | QuestionPhotos) => void;
  handleQuestionPhotosChange?: (questionField: string, photos: File[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  isSubmitting?: boolean;
  setIsSubmitting?: (submitting: boolean) => void;
  navigate?: any;
  user?: any;
}
