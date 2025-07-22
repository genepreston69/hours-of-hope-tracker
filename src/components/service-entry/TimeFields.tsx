
import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ServiceEntryFormValues } from "./types";

interface TimeFieldsProps {
  control: Control<ServiceEntryFormValues>;
}

export const TimeFields = ({ control }: TimeFieldsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormField
        control={control}
        name="startTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Start Time *</FormLabel>
            <FormControl>
              <Input 
                type="time" 
                required
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="endTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>End Time *</FormLabel>
            <FormControl>
              <Input 
                type="time" 
                required
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
