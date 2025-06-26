
import { format } from "date-fns";
import { ServiceEntry } from "@/models/types";
import { ReportFilters } from "./ReportFilters";
import { DateFilterType } from "@/components/dashboard/DateFilter";

export const exportToCSV = (
  sortedEntries: ServiceEntry[], 
  filters: ReportFilters, 
  dateFilter?: DateFilterType
) => {
  let csvContent = "date,customer,location,residents,hours_worked,total_hours,notes\r\n";

  sortedEntries.forEach((entry) => {
    const formattedDate = format(new Date(entry.date), "yyyy-MM-dd");
    // Quote strings that might contain commas
    const row = [
      formattedDate,
      `"${entry.customerName}"`,
      `"${entry.location}"`,
      entry.numberOfResidents,
      entry.hoursWorked,
      entry.totalHours,
      `"${entry.notes || ""}"`
    ];
    csvContent += row.join(",") + "\r\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  // Create filename with current date
  const today = format(new Date(), "yyyy-MM-dd");
  let filename = `service_report_${today}`;
  
  // Add date filter info to filename if provided
  if (dateFilter) {
    filename += `_${dateFilter.toUpperCase()}`;
  }
  
  // Add filter info to filename
  if (filters.location !== "all") filename += `_${filters.location}`;
  if (filters.customer !== "all") filename += `_${filters.customer}`;
  
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
