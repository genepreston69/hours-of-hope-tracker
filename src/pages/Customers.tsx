
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Customer } from "@/models/types";
import { CustomerList } from "@/components/customers/CustomerList";
import { CustomerImport } from "@/components/customers/CustomerImport";
import { CustomerActions } from "@/components/customers/CustomerActions";
import { EditCustomerDialog } from "@/components/customers/EditCustomerDialog";

const Customers = () => {
  const { customers, addCustomer, updateCustomer, importCustomers, deleteCustomer } = useAppContext();
  const [isImporting, setIsImporting] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);

  const handleEditCustomer = (customer: Customer) => {
    setCustomerToEdit(customer);
    setIsEditDialogOpen(true);
  };

  const handleDeleteCustomer = (id: string) => {
    deleteCustomer(id);
  };

  const downloadSampleCSV = () => {
    const csvContent = "name,contactName,contactEmail,contactPhone\nSample Company,John Doe,john.doe@example.com,555-123-4567";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "sample_customers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-bold">Customer Management</h1>
        <CustomerActions
          onAddCustomer={addCustomer}
          onOpenImport={() => setIsImporting(true)}
          onDownloadTemplate={downloadSampleCSV}
        />
      </div>

      <EditCustomerDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        customer={customerToEdit}
        onUpdateCustomer={updateCustomer}
      />

      <CustomerImport
        isOpen={isImporting}
        onClose={() => setIsImporting(false)}
        onImportCustomers={importCustomers}
      />

      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
          <CardDescription>Manage your customers and their contact information.</CardDescription>
        </CardHeader>
        <CardContent>
          <CustomerList
            customers={customers}
            onEditCustomer={handleEditCustomer}
            onDeleteCustomer={handleDeleteCustomer}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;
