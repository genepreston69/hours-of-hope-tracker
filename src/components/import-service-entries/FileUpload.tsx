
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { downloadCSVTemplate } from "./import-utils";

interface FileUploadProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const FileUpload = ({ onFileChange, disabled = false }: FileUploadProps) => {
  return (
    <div className="space-y-2">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="csv-file-input">Upload CSV File</Label>
        <div className="flex space-x-2">
          <Input 
            id="csv-file-input" 
            type="file" 
            accept=".csv" 
            onChange={onFileChange} 
            disabled={disabled}
          />
          <Button 
            variant="outline" 
            onClick={downloadCSVTemplate} 
            disabled={disabled}
          >
            Get Template
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Upload a CSV file with columns: Date (MM/DD/YYYY), Customer, FacilityLocation, NumberOfResidents, Hours, Notes (optional)
      </p>
    </div>
  );
};

export default FileUpload;
