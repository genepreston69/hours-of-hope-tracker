
import { Control } from "react-hook-form";
import { Customer } from "@/models/types";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ServiceEntryFormValues } from "./types";

interface CustomerFieldProps {
  control: Control<ServiceEntryFormValues>;
  customers: Customer[];
}

export const CustomerField = ({ control, customers }: CustomerFieldProps) => {
  return (
    <FormField
      control={control}
      name="customerId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Customer</FormLabel>
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
              {customers.length > 0 ? (
                customers.map((customer) => (
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
  );
};
