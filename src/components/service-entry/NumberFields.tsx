
import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ServiceEntryFormValues } from "./types";

interface NumberFieldsProps {
  control: Control<ServiceEntryFormValues>;
}

export const NumberFields = ({ control }: NumberFieldsProps) => {
  return (
    <FormField
      control={control}
      name="numberOfResidents"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Number of Volunteers *</FormLabel>
          <FormControl>
            <Input 
              type="number" 
              placeholder="Number of volunteers"
              min="1"
              step="1"
              {...field}
              value={field.value === undefined ? "" : field.value}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
