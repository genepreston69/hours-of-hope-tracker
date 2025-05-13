
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CSVServiceEntry, ServiceEntry } from "@/models/types";
import { toast } from "@/components/ui/sonner";
import FileUpload from "./import-service-entries/FileUpload";
import ErrorDisplay from "./import-service-entries/ErrorDisplay";
import PreviewTable from "./import-service-entries/PreviewTable";
import { validateAndParseCSV, createServiceEntriesFromCSV } from "./import-service-entries/import-utils";

const ImportServiceEntries = () => {
  const { customers, importServiceEntries } = useAppContext();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<CSVServiceEntry[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview([]);
    setErrors([]);

    // Read the file content
    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target?.result as string;
      validateAndParseCSV(csvText, setErrors, setPreview);
    };
    reader.readAsText(selectedFile);
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

    try {
      console.log("Creating service entries from CSV with customers:", customers);
      const serviceEntries = createServiceEntriesFromCSV(preview, customers);
      console.log("Created service entries:", serviceEntries);
      importServiceEntries(serviceEntries);
      toast.success(`${serviceEntries.length} service entries imported successfully`);
      resetForm();
    } catch (error) {
      console.error("Error during import:", error);
      toast.error(`Import failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreview([]);
    setErrors([]);
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
        <FileUpload onFileChange={handleFileChange} />
        {file && <p className="text-sm mt-2">Selected: {file.name}</p>}
        <ErrorDisplay errors={errors} />
        <PreviewTable preview={preview} />
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleImport} 
          disabled={!preview.length || errors.length > 0}
          className="w-full"
        >
          Import {preview.length} Service Entries
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ImportServiceEntries;
