
import { useState } from "react";
import { Customer } from "@/models/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Upload, Download, FileDown } from "lucide-react";
import { CustomerForm } from "./CustomerForm";
import { exportCustomersToCSV } from "./CustomerExport";

interface CustomerActionsProps {
  onAddCustomer: (customer: Customer) => void;
  onOpenImport: () => void;
  onDownloadTemplate: () => void;
  customers: Customer[];
}

export const CustomerActions = ({ onAddCustomer, onOpenImport, onDownloadTemplate, customers }: CustomerActionsProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleExportCustomers = () => {
    exportCustomersToCSV(customers);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Enter the customer details below.
            </DialogDescription>
          </DialogHeader>
          <CustomerForm
            onSubmit={(customer) => {
              onAddCustomer(customer);
              setIsAddDialogOpen(false);
            }}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Button variant="outline" onClick={onOpenImport}>
        <Upload className="h-4 w-4 mr-2" />
        Import CSV
      </Button>

      <Button variant="outline" onClick={onDownloadTemplate}>
        <FileDown className="h-4 w-4 mr-2" />
        Download Template
      </Button>

      <Button variant="outline" onClick={handleExportCustomers}>
        <Download className="h-4 w-4 mr-2" />
        Export Customers
      </Button>
    </div>
  );
};
