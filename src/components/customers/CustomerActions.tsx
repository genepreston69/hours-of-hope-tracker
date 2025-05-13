
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, Upload, Users } from "lucide-react";
import { CustomerForm, CustomerFormData } from "./CustomerForm";
import { Customer } from "@/models/types";
import { generateId } from "@/lib/utils";

interface CustomerActionsProps {
  onAddCustomer: (customer: Customer) => void;
  onOpenImport: () => void;
  onDownloadTemplate: () => void;
}

export const CustomerActions = ({ onAddCustomer, onOpenImport, onDownloadTemplate }: CustomerActionsProps) => {
  const handleSubmit = (values: CustomerFormData) => {
    const newCustomer: Customer = {
      id: generateId(),
      name: values.name,
      contactName: values.contactName || undefined,
      contactEmail: values.contactEmail || undefined,
      contactPhone: values.contactPhone || undefined,
      street: values.street || undefined,
      city: values.city || undefined,
      state: values.state || undefined,
      zip: values.zip || undefined,
    };

    onAddCustomer(newCustomer);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
      <Button variant="outline" onClick={onDownloadTemplate}>
        <Download className="h-4 w-4 mr-2" />
        Download CSV Template
      </Button>
      <Button onClick={onOpenImport}>
        <Upload className="h-4 w-4 mr-2" />
        Import Customers
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Users className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Enter the customer details below.
            </DialogDescription>
          </DialogHeader>
          <CustomerForm 
            onSubmit={handleSubmit} 
            buttonText="Save Customer" 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
