
import { Control } from "react-hook-form";
import { MapPin } from "lucide-react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LOCATION_OPTIONS } from "@/constants/locations";
import { ServiceEntryFormValues } from "./types";

interface LocationFieldProps {
  control: Control<ServiceEntryFormValues>;
}

export const LocationField = ({ control }: LocationFieldProps) => {
  return (
    <FormField
      control={control}
      name="facilityLocationId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Location</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a location">
                  <div className="flex items-center gap-2">
                    {field.value && (
                      <>
                        <MapPin className="h-4 w-4" /> {field.value}
                      </>
                    )}
                  </div>
                </SelectValue>
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {LOCATION_OPTIONS.map((location) => (
                <SelectItem key={location} value={location}>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> {location}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>
            Where the service was performed.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
