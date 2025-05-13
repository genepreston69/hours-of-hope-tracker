
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ErrorDisplayProps {
  errors: string[];
}

const ErrorDisplay = ({ errors }: ErrorDisplayProps) => {
  if (errors.length === 0) return null;
  
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Import Errors</AlertTitle>
      <AlertDescription>
        <ul className="list-disc pl-5 mt-2">
          {errors.map((error, index) => (
            <li key={index} className="text-sm">{error}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
};

export default ErrorDisplay;
