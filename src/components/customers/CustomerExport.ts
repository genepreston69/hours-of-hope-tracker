
import { format } from "date-fns";
import { Customer } from "@/models/types";

export const exportCustomersToCSV = (customers: Customer[]) => {
  let csvContent = "name,contact_name,contact_email,contact_phone,street,city,state,zip\r\n";

  customers.forEach((customer) => {
    // Quote strings that might contain commas
    const row = [
      `"${customer.name}"`,
      `"${customer.contactName || ""}"`,
      `"${customer.contactEmail || ""}"`,
      `"${customer.contactPhone || ""}"`,
      `"${customer.street || ""}"`,
      `"${customer.city || ""}"`,
      `"${customer.state || ""}"`,
      `"${customer.zip || ""}"`
    ];
    csvContent += row.join(",") + "\r\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  // Create filename with current date
  const today = format(new Date(), "yyyy-MM-dd");
  const filename = `customers_${today}`;
  
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
