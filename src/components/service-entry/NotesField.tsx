
import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ServiceEntryFormValues } from "./types";

interface NotesFieldProps {
  control: Control<ServiceEntryFormValues>;
}

export const NotesField = ({ control }: NotesFieldProps) => {
  return (
    <FormField
      control={control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Notes (Optional)</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Add any additional details about the service performed"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
