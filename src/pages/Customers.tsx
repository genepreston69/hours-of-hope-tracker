
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Customer } from "@/models/types";
import { CustomerList } from "@/components/customers/CustomerList";
import { CustomerImport } from "@/components/customers/CustomerImport";
import { CustomerActions } from "@/components/customers/CustomerActions";
import { EditCustomerDialog } from "@/components/customers/EditCustomerDialog";
import { Loader2 } from "lucide-react";

const Customers = () => {
  const { customers, addCustomer, updateCustomer, importCustomers, deleteCustomer, isLoading } = useAppContext();
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
    const csvContent = "name,contactName,contactEmail,contactPhone,street,city,state,zip\nSample Company,John Doe,john.doe@example.com,555-123-4567,123 Main St,Anytown,WV,12345";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "sample_customers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-lg text-slate-700">Loading customers from database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-bold text-slate-900">Customer Management</h1>
        <CustomerActions
          onAddCustomer={addCustomer}
          onOpenImport={() => setIsImporting(true)}
          onDownloadTemplate={downloadSampleCSV}
          customers={customers}
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

      <Card className="bg-white/80 backdrop-blur-xl border border-slate-200/60 nav-shadow">
        <CardHeader>
          <CardTitle className="text-slate-900">Customers</CardTitle>
          <CardDescription className="text-slate-600">Manage your customers and their contact information.</CardDescription>
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
