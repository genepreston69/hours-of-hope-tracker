
import { CSVServiceEntry, LocationOption, ServiceEntry } from "@/models/types";
import { parse } from "date-fns";
import { generateUUID, parseCSV } from "@/lib/utils";
import { LOCATION_OPTIONS, getLocationIdByName } from "@/constants/locations";
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
        const locationName = row[2].trim();
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
        
        // Validate location name
        if (!locationName) {
          newErrors.push(`Row ${index + 2}: Missing facility location`);
          return;
        }

        // Check if the location name is in our predefined list - use case-insensitive comparison
        const locationMatch = LOCATION_OPTIONS.find(
          loc => loc.toLowerCase() === locationName.toLowerCase()
        );
        
        if (!locationMatch) {
          newErrors.push(`Row ${index + 2}: Invalid facility location "${locationName}". Must be one of: ${LOCATION_OPTIONS.join(", ")}`);
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
          facilityLocationId: locationMatch, // Store the exact match from our options
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
  console.log("Creating service entries with:", { preview, customers });
  
  return preview.map(entry => {
    // Find customer ID by name - using case-insensitive match with trimmed whitespace
    const customer = customers.find(c => 
      c.name.trim().toLowerCase() === entry.customer.trim().toLowerCase()
    );
    
    if (!customer) {
      console.error(`Customer not found: "${entry.customer}". Available customers:`, customers.map(c => c.name));
      throw new Error(`Customer "${entry.customer}" not found`);
    }

    // Parse date from MM/DD/YYYY format
    const date = parse(entry.date, "MM/dd/yyyy", new Date());
    
    // Get the exact location name from our options for consistent casing
    const exactLocationName = LOCATION_OPTIONS.find(
      loc => loc.toLowerCase() === entry.facilityLocationId.toLowerCase()
    ) as LocationOption;
    
    if (!exactLocationName) {
      console.error(`Location not found in options: "${entry.facilityLocationId}"`);
      throw new Error(`Location "${entry.facilityLocationId}" not found in valid options`);
    }
    
    // Convert location name to ID using the utility function
    const locationId = getLocationIdByName(exactLocationName);
    
    if (!locationId) {
      console.error(`Location ID not found for: "${exactLocationName}"`);
      throw new Error(`Location ID for "${exactLocationName}" not found or invalid`);
    }
    
    console.log(`Mapped location "${entry.facilityLocationId}" (normalized to "${exactLocationName}") to ID: ${locationId}`);
    
    return {
      id: generateUUID(),
      date,
      customerId: customer.id,
      customerName: customer.name,
      facilityLocationId: locationId,
      location: exactLocationName, // Store the normalized display name
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
