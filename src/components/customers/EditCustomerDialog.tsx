
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Customer } from "@/models/types";
import { CustomerForm, CustomerFormData } from "./CustomerForm";

interface EditCustomerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  onUpdateCustomer: (id: string, updatedCustomer: Partial<Customer>) => void;
}

export const EditCustomerDialog = ({
  isOpen,
  onClose,
  customer,
  onUpdateCustomer,
}: EditCustomerDialogProps) => {
  if (!customer) return null;

  const handleSubmit = (values: CustomerFormData) => {
    onUpdateCustomer(customer.id, {
      name: values.name,
      contactName: values.contactName || undefined,
      contactEmail: values.contactEmail || undefined,
      contactPhone: values.contactPhone || undefined,
      street: values.street || undefined,
      city: values.city || undefined,
      state: values.state || undefined,
      zip: values.zip || undefined,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Customer</DialogTitle>
          <DialogDescription>
            Update the customer details below and save your changes.
          </DialogDescription>
        </DialogHeader>
        <CustomerForm
          onSubmit={handleSubmit}
          defaultValues={{
            name: customer.name,
            contactName: customer.contactName || "",
            contactEmail: customer.contactEmail || "",
            contactPhone: customer.contactPhone || "",
            street: customer.street || "",
            city: customer.city || "",
            state: customer.state || "",
            zip: customer.zip || "",
          }}
          buttonText="Update Customer"
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
