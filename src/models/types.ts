
export interface Customer {
  id: string;
  name: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface ServiceEntry {
  id: string;
  date: Date;
  customerId: string;
  customerName: string;
  location: string;
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
