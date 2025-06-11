
import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { TiptapEditor } from "@/components/ui/tiptap-editor";
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
            <TiptapEditor
              content={field.value || ''}
              onChange={field.onChange}
              placeholder="Add any additional details about the service performed"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
