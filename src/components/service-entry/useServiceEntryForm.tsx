
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/sonner";
import { useAppContext } from "@/context/AppContext";
import { generateId } from "@/lib/utils";
import { formSchema, ServiceEntryFormValues } from "./types";

export const useServiceEntryForm = () => {
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
  useEffect(() => {
    if (hoursWorked && numberOfResidents) {
      setTotalHours(calculateTotalHours(hoursWorked, numberOfResidents));
    } else {
      setTotalHours(null);
    }
  }, [hoursWorked, numberOfResidents]);

  return {
    form,
    onSubmit,
    totalHours,
    customers,
  };
};
