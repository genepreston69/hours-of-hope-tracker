
import { Control } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ServiceEntryFormValues } from "./types";

interface NumberFieldsProps {
  control: Control<ServiceEntryFormValues>;
}

export const NumberFields = ({ control }: NumberFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="hoursWorked"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hours Worked</FormLabel>
            <FormControl>
              <Input
                type="number"
                step={0.5}
                min={0.5}
                max={24}
                placeholder="Hours per volunteer"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Hours worked per volunteer.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="numberOfResidents"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Volunteers</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={1}
                placeholder="Number of volunteers"
                {...field}
              />
            </FormControl>
            <FormDescription>
              How many volunteers participated.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
