
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { LOCATION_OPTIONS } from "@/constants/locations";
import { downloadCSVTemplate } from "./import-utils";

const FileUpload = ({ onFileChange }: { onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
  return (
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
                  <li><strong>FacilityLocation</strong>: Should be one of: {LOCATION_OPTIONS.join(", ")}</li>
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
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Customer names must match exactly with existing customers (case-insensitive).</li>
                      <li>Facility locations should be one of the options listed above.</li>
                    </ul>
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
          onChange={onFileChange}
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
      </div>
    </div>
  );
};

export default FileUpload;
