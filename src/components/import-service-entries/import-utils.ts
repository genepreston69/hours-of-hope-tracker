
import { CSVServiceEntry, LocationOption, ServiceEntry } from "@/models/types";
import { parse } from "date-fns";
import { generateId, parseCSV } from "@/lib/utils";
import { LOCATION_OPTIONS } from "@/constants/locations";
import { toast } from "@/components/ui/sonner";

export function validateAndParseCSV(
  csvText: string,
  setErrors: (errors: string[]) => void,
  setPreview: (entries: CSVServiceEntry[]) => void
): boolean {
  try {
    const rows = parseCSV(csvText);
    
    // Skip header row
    const dataRows = rows.slice(1);
    
    // Check if file has content
    if (dataRows.length === 0) {
      setErrors(["CSV file is empty or contains only headers"]);
      return false;
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
        // Expected format: date, customer, facilityLocationId, numberOfResidents, hoursWorked, [notes]
        const dateStr = row[0].trim();
        const customer = row[1].trim();
        const facilityLocationId = row[2].trim();
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
        
        // Validate facility location is one of the valid options
        if (!LOCATION_OPTIONS.includes(facilityLocationId as LocationOption)) {
          newErrors.push(`Row ${index + 2}: Invalid facility location. Must be one of: ${LOCATION_OPTIONS.join(", ")}`);
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
          facilityLocationId,
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
    return newErrors.length === 0;
  } catch (error) {
    console.error("Error parsing CSV:", error);
    setErrors(["Failed to parse CSV file. Please check the format."]);
    return false;
  }
}

export function createServiceEntriesFromCSV(
  preview: CSVServiceEntry[],
  customers: { id: string; name: string }[]
): ServiceEntry[] {
  return preview.map(entry => {
    // Find customer ID by name - using case-insensitive match with trimmed whitespace
    const customer = customers.find(c => 
      c.name.trim().toLowerCase() === entry.customer.trim().toLowerCase()
    );
    
    if (!customer) {
      throw new Error(`Customer "${entry.customer}" not found`);
    }

    // Parse date from MM/DD/YYYY format
    const date = parse(entry.date, "MM/dd/yyyy", new Date());
    
    return {
      id: generateId(),
      date,
      customerId: customer.id,
      customerName: customer.name,
      facilityLocationId: entry.facilityLocationId,
      location: entry.facilityLocationId, // For backward compatibility
      numberOfResidents: entry.numberOfResidents,
      hoursWorked: entry.hoursWorked,
      totalHours: entry.numberOfResidents * entry.hoursWorked,
      notes: entry.notes || "",
      createdAt: new Date()
    };
  });
}

export function generateCSVTemplate(): string {
  // Update headers to match the expected fields
  const headers = ["Date", "Customer", "FacilityLocation", "NumberOfResidents", "Hours", "Description"];
  const exampleData = [
    "05/01/2023,Community Center,Bluefield,5,3.5,Monthly cleanup event",
    "05/15/2023,City Park,Charleston,3,2,Gardening service"
  ];
  
  return [headers.join(","), ...exampleData].join("\n");
}

export function downloadCSVTemplate() {
  const csvContent = generateCSVTemplate();
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
}
