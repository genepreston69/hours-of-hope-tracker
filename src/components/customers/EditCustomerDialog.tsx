
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
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Customer</DialogTitle>
          <DialogDescription>
            Update the customer details below.
          </DialogDescription>
        </DialogHeader>
        <CustomerForm
          onSubmit={handleSubmit}
          defaultValues={{
            name: customer.name,
            contactName: customer.contactName || "",
            contactEmail: customer.contactEmail || "",
            contactPhone: customer.contactPhone || "",
          }}
          buttonText="Update Customer"
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
