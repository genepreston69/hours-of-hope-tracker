import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { generateId } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/components/ui/sonner";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MapPin } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { LocationOption } from "@/models/types";
import { LOCATION_OPTIONS } from "@/constants/locations";

const formSchema = z.object({
  date: z.date({
    required_error: "Service date is required",
  }),
  customerId: z.string({
    required_error: "Please select a customer",
  }),
  facilityLocationId: z.enum(["Bluefield", "Charleston", "Huntington", "Parkersburg"], {
    required_error: "Please select a location",
  }),
  hoursWorked: z.coerce
    .number()
    .positive("Hours must be greater than 0")
    .max(24, "Hours cannot exceed 24"),
  numberOfResidents: z.coerce
    .number()
    .int("Number of volunteers must be a whole number")
    .positive("Number of volunteers must be greater than 0"),
  notes: z.string().optional(),
});

export type ServiceEntryFormValues = z.infer<typeof formSchema>;

const ServiceEntryForm = () => {
  const { customers, addServiceEntry, getCustomerById } = useAppContext();
  const [totalHours, setTotalHours] = useState<number | null>(null);

  const form = useForm<ServiceEntryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      notes: "",
    },
  });

  const calculateTotalHours = (hours: number, residents: number) => {
    return hours * residents;
  };

  const onSubmit = (data: ServiceEntryFormValues) => {
    const customer = getCustomerById(data.customerId);
    if (!customer) {
      toast.error("Selected customer not found");
      return;
    }

    const calculatedTotalHours = calculateTotalHours(
      data.hoursWorked,
      data.numberOfResidents
    );

    const serviceEntry = {
      id: generateId(),
      date: data.date,
      customerId: data.customerId,
      customerName: customer.name,
      facilityLocationId: data.facilityLocationId,
      location: data.facilityLocationId, // Add location for backward compatibility
      hoursWorked: data.hoursWorked,
      numberOfResidents: data.numberOfResidents,
      totalHours: calculatedTotalHours,
      notes: data.notes || "",
      createdAt: new Date(),
    };

    addServiceEntry(serviceEntry);
    form.reset({
      date: new Date(),
      customerId: "",
      facilityLocationId: undefined,
      hoursWorked: undefined,
      numberOfResidents: undefined,
      notes: "",
    });
    setTotalHours(null);
  };

  // Watch for changes in hours and residents to calculate total hours
  const hoursWorked = form.watch("hoursWorked");
  const numberOfResidents = form.watch("numberOfResidents");

  // Update total hours when either value changes
  const updateTotalHours = () => {
    if (hoursWorked && numberOfResidents) {
      setTotalHours(calculateTotalHours(hoursWorked, numberOfResidents));
    } else {
      setTotalHours(null);
    }
  };

  // Use React Hook Form's watch to automatically call updateTotalHours
  // whenever hoursWorked or numberOfResidents change
  form.watch(() => {
    updateTotalHours();
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Service Entry</CardTitle>
        <CardDescription>
          Record hours worked by recovery volunteers for a customer.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Service Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date()}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    The date when the service was performed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
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

            <FormField
              control={form.control}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
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
                control={form.control}
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

            {totalHours !== null && (
              <div className="p-4 bg-muted/50 rounded-md">
                <h3 className="font-medium text-sm text-muted-foreground">
                  Total Service Hours
                </h3>
                <p className="text-2xl font-bold">{totalHours}</p>
              </div>
            )}

            <FormField
              control={form.control}
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

            <Button type="submit" disabled={customers.length === 0}>
              Submit Service Entry
            </Button>
            {customers.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Please add customers before entering service hours.
              </p>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ServiceEntryForm;
