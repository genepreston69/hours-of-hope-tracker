
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CSVServiceEntry, ServiceEntry } from "@/models/types";
import { toast } from "@/components/ui/sonner";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { X, CheckCircle, AlertCircle, Loader } from "lucide-react";
import FileUpload from "./import-service-entries/FileUpload";
import ErrorDisplay from "./import-service-entries/ErrorDisplay";
import PreviewTable from "./import-service-entries/PreviewTable";
import ValidationSummary from "./import-service-entries/ValidationSummary";
import { validateAndParseCSV, createServiceEntriesFromCSV } from "./import-service-entries/import-utils";

const ImportServiceEntries = () => {
  const { customers, importServiceEntries } = useAppContext();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<CSVServiceEntry[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [validationStats, setValidationStats] = useState({
    total: 0,
    valid: 0,
    invalid: 0
  });

  // Process file in a simulated "background" process
  useEffect(() => {
    if (!file || isProcessing) return;

    const processFile = async () => {
      setIsProcessing(true);
      setProgress(10);
      
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const csvText = event.target?.result as string;
          setProgress(40);
          
          setTimeout(() => {
            try {
              const result = validateAndParseCSV(csvText, setErrors, setPreview);
              setProgress(80);
              
              // Calculate validation statistics
              const total = csvText.split(/\r?\n/).length - 1; // Subtract header row
              const validCount = preview.length;
              const invalidCount = errors.length > 0 ? total - validCount : 0;
              
              setValidationStats({
                total: total,
                valid: validCount,
                invalid: invalidCount
              });
              
              setProgress(100);
              setTimeout(() => setIsProcessing(false), 500); // Short delay to show completed progress
            } catch (error) {
              console.error("Error parsing CSV:", error);
              setErrors(["Failed to parse CSV file. Please check the format."]);
              setIsProcessing(false);
            }
          }, 500); // Simulate processing time
        } catch (error) {
          console.error("Error reading file:", error);
          setErrors(["Failed to read file. Please try again."]);
          setIsProcessing(false);
        }
      };
      
      reader.onerror = () => {
        setErrors(["Failed to read file. Please try again."]);
        setIsProcessing(false);
      };
      
      reader.readAsText(file);
    };
    
    processFile();
  }, [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Reset state for new file
    setFile(selectedFile);
    setPreview([]);
    setErrors([]);
    setProgress(0);
    setValidationStats({ total: 0, valid: 0, invalid: 0 });
  };

  const handleImport = () => {
    if (!preview.length) {
      toast.error("No valid entries to import");
      return;
    }

    if (errors.length > 0) {
      toast.error("Please fix errors before importing");
      return;
    }

    setIsProcessing(true);
    setProgress(20);

    // Simulate a more gradual progress during import
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    try {
      console.log("Creating service entries from CSV with customers:", customers);
      const serviceEntries = createServiceEntriesFromCSV(preview, customers);
      console.log("Created service entries:", serviceEntries);
      
      // After a brief delay to show progress, complete the import
      setTimeout(() => {
        importServiceEntries(serviceEntries);
        clearInterval(progressInterval);
        setProgress(100);
        toast.success(`${serviceEntries.length} service entries imported successfully`);
        
        // Reset form after short delay to show 100% completion
        setTimeout(() => {
          resetForm();
          setIsProcessing(false);
        }, 500);
      }, 1000);
    } catch (error) {
      clearInterval(progressInterval);
      console.error("Error during import:", error);
      toast.error(`Import failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      setIsProcessing(false);
    }
  };

  const cancelProcessing = () => {
    setIsProcessing(false);
    setProgress(0);
    setIsCancelDialogOpen(false);
    toast.info("Import operation canceled");
  };

  const resetForm = () => {
    setFile(null);
    setPreview([]);
    setErrors([]);
    setProgress(0);
    setIsProcessing(false);
    setValidationStats({ total: 0, valid: 0, invalid: 0 });
    // Reset the file input
    const fileInput = document.getElementById("csv-file-input") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Import Service Entries</CardTitle>
        <CardDescription>
          Upload a CSV file with service entry data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FileUpload onFileChange={handleFileChange} disabled={isProcessing} />
        
        {file && (
          <div className="flex items-center justify-between">
            <p className="text-sm">Selected: {file.name}</p>
            {isProcessing ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsCancelDialogOpen(true)}
                className="ml-2"
              >
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetForm}
                className="ml-2"
              >
                <X className="h-4 w-4 mr-1" /> Remove
              </Button>
            )}
          </div>
        )}
        
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Loader className="h-4 w-4 animate-spin" />
              <p className="text-sm">{progress < 100 ? "Processing..." : "Complete!"}</p>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        <ErrorDisplay errors={errors} />
        
        {file && validationStats.total > 0 && !isProcessing && (
          <ValidationSummary 
            totalRows={validationStats.total}
            validRows={validationStats.valid}
            invalidRows={validationStats.invalid}
          />
        )}
        
        <PreviewTable preview={preview} />
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleImport} 
          disabled={!preview.length || errors.length > 0 || isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Importing...
            </>
          ) : (
            <>Import {preview.length} Service Entries</>
          )}
        </Button>
      </CardFooter>

      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Import?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this import operation? Any progress will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Import</AlertDialogCancel>
            <AlertDialogAction onClick={cancelProcessing}>
              Yes, Cancel Import
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default ImportServiceEntries;
