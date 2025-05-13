
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CSVServiceEntry, ServiceEntry } from "@/models/types";
import { toast } from "@/components/ui/sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertCircle, Download, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LOCATION_OPTIONS } from "@/constants/locations";
import { validateAndParseCSV, createServiceEntriesFromCSV, downloadCSVTemplate } from "./import-service-entries/import-utils";

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
      setFile(null);
      setPreview([]);
      setErrors([]);
      // Reset the file input
      const fileInput = document.getElementById("csv-file-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Error during import:", error);
      toast.error(`Import failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
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
        <div className="grid gap-6">
          <div className="flex flex-col gap-2">
            <Button 
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={downloadCSVTemplate}
            >
              <Download className="h-4 w-4" />
              Download CSV Template
            </Button>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="csv-format">
                <AccordionTrigger className="text-sm">CSV File Format Instructions</AccordionTrigger>
                <AccordionContent>
                  <div className="text-sm space-y-2">
                    <p>Your CSV file should have the following column headers in the first row:</p>
                    <ol className="list-decimal ml-5">
                      <li><strong>Date</strong>: In format MM/DD/YYYY (e.g., 05/15/2023)</li>
                      <li><strong>Customer</strong>: Must match an existing customer name exactly</li>
                      <li><strong>FacilityLocation</strong>: Must be one of: {LOCATION_OPTIONS.join(", ")}</li>
                      <li><strong>NumberOfResidents</strong>: A positive whole number</li>
                      <li><strong>Hours</strong>: Hours per resident (positive number)</li>
                      <li><strong>Description</strong>: Optional additional information</li>
                    </ol>
                    <p className="mt-2 text-muted-foreground">Example:</p>
                    <pre className="p-2 bg-muted rounded-md overflow-x-auto text-xs">
                      Date,Customer,FacilityLocation,NumberOfResidents,Hours,Description<br/>
                      05/01/2023,Community Center,Bluefield,5,3.5,Monthly cleanup event
                    </pre>
                    <p className="mt-2 text-muted-foreground">The first row should contain these exact header names and will be skipped during import.</p>
                    <Alert className="mt-3">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Important</AlertTitle>
                      <AlertDescription>
                        Customer names must match exactly with existing customers in the system (case-sensitive).
                      </AlertDescription>
                    </Alert>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          <div>
            <input
              id="csv-file-input"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button 
              variant="secondary" 
              className="w-full"
              onClick={() => document.getElementById("csv-file-input")?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Select CSV File
            </Button>
            {file && <p className="text-sm mt-2">Selected: {file.name}</p>}
          </div>
          
          {errors.length > 0 && (
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
          )}
          
          {preview.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Preview ({preview.length} entries)</h3>
              <div className="border rounded-md overflow-auto max-h-64">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Date</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Customer</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Facility Location</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Residents</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Hours</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Total Hours</th>
                    </tr>
                  </thead>
                  <tbody className="bg-popover divide-y divide-muted">
                    {preview.map((entry, index) => (
                      <tr key={index} className="hover:bg-muted/50">
                        <td className="px-3 py-2 whitespace-nowrap text-xs">{entry.date}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs">{entry.customer}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs">{entry.facilityLocationId}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs">{entry.numberOfResidents}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs">{entry.hoursWorked}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs">{entry.numberOfResidents * entry.hoursWorked}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
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
