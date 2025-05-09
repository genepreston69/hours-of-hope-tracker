
export interface Customer {
  id: string;
  name: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export type LocationOption = 'Bluefield' | 'Charleston' | 'Huntington' | 'Parkersburg';

export interface ServiceEntry {
  id: string;
  date: Date;
  customerId: string;
  customerName: string;
  facilityLocationId: string;
  location?: string; // Add this field for backward compatibility
  numberOfResidents: number;
  hoursWorked: number;
  totalHours: number;
  notes?: string;
  createdAt: Date;
}

export interface ServiceStats {
  totalEntries: number;
  totalHours: number;
  totalResidents: number;
  averageHoursPerResident: number;
}

export interface LocationStats {
  location: string;
  entries: number;
  hours: number;
  residents: number;
}

export interface CSVServiceEntry {
  date: string;
  customer: string;
  facilityLocationId: string;
  numberOfResidents: number;
  hoursWorked: number;
  notes?: string;
}
