
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Customer } from "@/models/types";
import { generateId, parseCSV } from "@/lib/utils";

interface CustomerImportProps {
  isOpen: boolean;
  onClose: () => void;
  onImportCustomers: (customers: Customer[]) => void;
}

export const CustomerImport = ({ isOpen, onClose, onImportCustomers }: CustomerImportProps) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0]);
      setImportError(null);
    }
  };

  const handleImport = () => {
    if (!csvFile) {
      setImportError("Please select a CSV file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        if (!event.target || typeof event.target.result !== "string") {
          throw new Error("Failed to read file");
        }

        const csvData = parseCSV(event.target.result);
        
        // Check if there are rows of data
        if (csvData.length < 2) {
          throw new Error("CSV file is empty or malformed");
        }

        // Get header row
        const headers = csvData[0].map(header => header.trim().toLowerCase());
        
        // Check for required columns
        const nameIndex = headers.indexOf("name");
        
        if (nameIndex === -1) {
          throw new Error("CSV must contain 'name' column");
        }
        
        // Find optional column indices
        const contactNameIndex = headers.indexOf("contactname");
        const contactEmailIndex = headers.indexOf("contactemail");
        const contactPhoneIndex = headers.indexOf("contactphone");
        
        // Parse data rows (skipping header)
        const customersData: Customer[] = csvData.slice(1).map((row) => {
          // Skip empty rows
          if (row.length <= 1 && !row[0]) return null;
          
          const name = row[nameIndex]?.trim();
          
          if (!name) return null;
          
          return {
            id: generateId(),
            name,
            contactName: contactNameIndex !== -1 ? row[contactNameIndex]?.trim() : undefined,
            contactEmail: contactEmailIndex !== -1 ? row[contactEmailIndex]?.trim() : undefined,
            contactPhone: contactPhoneIndex !== -1 ? row[contactPhoneIndex]?.trim() : undefined,
          };
        }).filter(Boolean) as Customer[];
        
        if (customersData.length === 0) {
          throw new Error("No valid customer data found in CSV");
        }
        
        onImportCustomers(customersData);
        setCsvFile(null);
        onClose();
        
        // Reset the file input
        const fileInput = document.getElementById('csv-file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
      } catch (error) {
        console.error("CSV import error:", error);
        setImportError(error instanceof Error ? error.message : "Failed to import CSV");
      }
    };

    reader.onerror = () => {
      setImportError("Failed to read file");
    };

    reader.readAsText(csvFile);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Customers from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file with customer data. The file must contain at least 'name' column.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="csv-file">CSV File</Label>
            <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} />
            {importError && <p className="text-sm text-destructive">{importError}</p>}
          </div>
          <div className="bg-muted p-3 rounded-md text-sm">
            <p className="font-medium">Required CSV Format:</p>
            <p className="mt-1">The first row should contain column headers:</p>
            <p className="font-mono text-xs mt-1">name,contactName,contactEmail,contactPhone</p>
            <p className="mt-2">Where 'name' is a required field.</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleImport} disabled={!csvFile}>Import Customers</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
