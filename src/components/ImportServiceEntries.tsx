
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CSVServiceEntry, ServiceEntry, LocationOption } from "@/models/types";
import { parseCSV } from "@/lib/utils";
import { generateId } from "@/lib/utils";
import { format, parse } from "date-fns";
import { toast } from "@/components/ui/sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertCircle, Download, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const LOCATION_OPTIONS: LocationOption[] = ["Bluefield", "Charleston", "Huntington", "Parkersburg"];

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
      try {
        const csvText = event.target?.result as string;
        const rows = parseCSV(csvText);
        
        // Skip header row
        const dataRows = rows.slice(1);
        
        // Check if file has content
        if (dataRows.length === 0) {
          setErrors(["CSV file is empty or contains only headers"]);
          return;
        }

        // Parse and validate each row
        const parsedEntries: CSVServiceEntry[] = [];
        const newErrors: string[] = [];

        dataRows.forEach((row, index) => {
          // Check if row has enough columns
          if (row.length < 5) {
            newErrors.push(`Row ${index + 2}: Not enough columns`);
            return;
          }

          try {
            // Expected format: date, customer, location, numberOfResidents, hoursWorked, [notes]
            const dateStr = row[0].trim();
            const customer = row[1].trim();
            const location = row[2].trim();
            const residents = parseInt(row[3].trim(), 10);
            const hours = parseFloat(row[4].trim());
            const notes = row.length > 5 ? row[5].trim() : "";

            // Validate date format (MM/DD/YYYY)
            let dateObj;
            try {
              dateObj = parse(dateStr, "MM/dd/yyyy", new Date());
              if (isNaN(dateObj.getTime())) {
                throw new Error();
              }
            } catch {
              newErrors.push(`Row ${index + 2}: Invalid date format. Use MM/DD/YYYY.`);
              return;
            }

            // Validate customer exists
            if (!customer) {
              newErrors.push(`Row ${index + 2}: Missing customer name`);
              return;
            }
            
            // Validate location is one of the valid options
            if (!LOCATION_OPTIONS.includes(location as LocationOption)) {
              newErrors.push(`Row ${index + 2}: Invalid location. Must be one of: ${LOCATION_OPTIONS.join(", ")}`);
              return;
            }

            // Validate number of residents
            if (isNaN(residents) || residents <= 0) {
              newErrors.push(`Row ${index + 2}: Invalid number of residents`);
              return;
            }

            // Validate hours worked
            if (isNaN(hours) || hours <= 0) {
              newErrors.push(`Row ${index + 2}: Invalid hours worked`);
              return;
            }

            parsedEntries.push({
              date: dateStr,
              customer,
              location,
              numberOfResidents: residents,
              hoursWorked: hours,
              notes
            });
          } catch (error) {
            newErrors.push(`Row ${index + 2}: Failed to parse data - ${error}`);
          }
        });

        setPreview(parsedEntries);
        setErrors(newErrors);
      } catch (error) {
        console.error("Error parsing CSV:", error);
        setErrors(["Failed to parse CSV file. Please check the format."]);
      }
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
      const serviceEntries: ServiceEntry[] = preview.map(entry => {
        // Find customer ID by name
        const customer = customers.find(c => c.name === entry.customer);
        if (!customer) {
          throw new Error(`Customer ${entry.customer} not found`);
        }

        // Parse date from MM/DD/YYYY format
        const date = parse(entry.date, "MM/dd/yyyy", new Date());
        
        return {
          id: generateId(),
          date,
          customerId: customer.id,
          customerName: customer.name,
          location: entry.location,
          numberOfResidents: entry.numberOfResidents,
          hoursWorked: entry.hoursWorked,
          totalHours: entry.numberOfResidents * entry.hoursWorked,
          notes: entry.notes || "",
          createdAt: new Date()
        };
      });

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

  const handleDownloadTemplate = () => {
    const headers = ["Date (MM/DD/YYYY)", "Customer Name", "Location", "Number of Residents", "Hours Worked", "Notes (optional)"];
    const exampleData = [
      "05/01/2023,Community Center,Bluefield,5,3.5,Monthly cleanup event",
      "05/15/2023,City Park,Charleston,3,2,Gardening service"
    ];
    
    const csvContent = [headers.join(","), ...exampleData].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "service-entries-template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
              onClick={handleDownloadTemplate}
            >
              <Download className="h-4 w-4" />
              Download CSV Template
            </Button>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="csv-format">
                <AccordionTrigger className="text-sm">CSV File Format Instructions</AccordionTrigger>
                <AccordionContent>
                  <div className="text-sm space-y-2">
                    <p>Your CSV file should have the following columns:</p>
                    <ol className="list-decimal ml-5">
                      <li><strong>Date</strong>: In format MM/DD/YYYY (e.g., 05/15/2023)</li>
                      <li><strong>Customer Name</strong>: Must match an existing customer name</li>
                      <li><strong>Location</strong>: Must be one of: {LOCATION_OPTIONS.join(", ")}</li>
                      <li><strong>Number of Residents</strong>: A positive whole number</li>
                      <li><strong>Hours Worked</strong>: Hours per resident (positive number)</li>
                      <li><strong>Notes</strong>: Optional additional information</li>
                    </ol>
                    <p className="mt-2 text-muted-foreground">The first row should be a header row and will be skipped during import.</p>
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
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Location</th>
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
                        <td className="px-3 py-2 whitespace-nowrap text-xs">{entry.location}</td>
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
