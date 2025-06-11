
import { FormData } from './useSurveyForm';

export interface SectionProps {
  formData: FormData;
  handleInputChange: (field: string, value: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  isSubmitting?: boolean;
  setIsSubmitting?: (submitting: boolean) => void;
  navigate?: any;
  user?: any;
}
