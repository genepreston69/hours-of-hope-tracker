
import { Control } from "react-hook-form";
import { Customer } from "@/models/types";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ServiceEntryFormValues } from "./types";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CustomerForm, CustomerFormData } from "@/components/customers/CustomerForm";
import { useAppContext } from "@/context/AppContext";
import { Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface CustomerFieldProps {
  control: Control<ServiceEntryFormValues>;
  customers: Customer[];
}

export const CustomerField = ({ control, customers }: CustomerFieldProps) => {
  const { addCustomer } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Sort customers alphabetically by name
  const sortedCustomers = [...customers].sort((a, b) => 
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );
  
  const handleAddCustomer = (values: CustomerFormData) => {
    const newCustomer: Customer = {
      id: uuidv4(),
      name: values.name,
      contactName: values.contactName || undefined,
      contactEmail: values.contactEmail || undefined,
      contactPhone: values.contactPhone || undefined,
      street: values.street || undefined,
      city: values.city || undefined,
      state: values.state || undefined,
      zip: values.zip || undefined,
    };
    
    addCustomer(newCustomer);
    setIsDialogOpen(false);
  };

  return (
    <>
      <div className="space-y-2">
        <FormField
          control={control}
          name="customerId"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Customer</FormLabel>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsDialogOpen(true)}
                  className="h-8"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Customer
                </Button>
              </div>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sortedCustomers.length > 0 ? (
                    sortedCustomers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No customers available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the customer where service was performed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Enter the customer details below.
            </DialogDescription>
          </DialogHeader>
          <CustomerForm 
            onSubmit={handleAddCustomer} 
            buttonText="Save Customer" 
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
