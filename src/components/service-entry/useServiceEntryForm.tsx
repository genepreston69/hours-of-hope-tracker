
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
      startTime: "",
      endTime: "",
      notes: "",
    },
  });

  const calculateHoursFromTime = (startTime: string, endTime: string): number => {
    if (!startTime || !endTime) return 0;
    
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    let hours = endHour - startHour;
    let minutes = endMinute - startMinute;
    
    // Handle negative minutes (e.g. if startTime = 9:45 and endTime = 10:15)
    if (minutes < 0) {
      hours -= 1;
      minutes += 60;
    }
    
    // Handle overnight shifts (end time is earlier than start time)
    if (hours < 0) {
      hours += 24;
    }
    
    return parseFloat((hours + minutes / 60).toFixed(2));
  };

  const calculateTotalHours = (hours: number, residents: number) => {
    return hours * residents;
  };

  const onSubmit = (data: ServiceEntryFormValues) => {
    const customer = getCustomerById(data.customerId);
    if (!customer) {
      toast.error("Selected customer not found");
      return;
    }

    // Calculate hours based on time fields if both are provided
    let hoursWorked = data.hoursWorked || 0;
    if (data.startTime && data.endTime) {
      hoursWorked = calculateHoursFromTime(data.startTime, data.endTime);
    }

    const calculatedTotalHours = calculateTotalHours(
      hoursWorked,
      data.numberOfResidents
    );

    const serviceEntry = {
      id: generateId(),
      date: data.date,
      customerId: data.customerId,
      customerName: customer.name,
      facilityLocationId: data.facilityLocationId,
      location: data.facilityLocationId, // Add location for backward compatibility
      hoursWorked: hoursWorked,
      numberOfResidents: data.numberOfResidents,
      totalHours: calculatedTotalHours,
      notes: data.notes || "",
      startTime: data.startTime || null,
      endTime: data.endTime || null,
      createdAt: new Date(),
    };

    addServiceEntry(serviceEntry);
    form.reset({
      date: new Date(),
      customerId: "",
      facilityLocationId: undefined,
      startTime: "",
      endTime: "",
      hoursWorked: undefined,
      numberOfResidents: undefined,
      notes: "",
    });
    setTotalHours(null);
  };

  // Watch for changes to calculate hours and total hours
  const startTime = form.watch("startTime");
  const endTime = form.watch("endTime");
  const manualHoursWorked = form.watch("hoursWorked");
  const numberOfResidents = form.watch("numberOfResidents");

  // Update hours worked field when time changes
  useEffect(() => {
    if (startTime && endTime) {
      const calculatedHours = calculateHoursFromTime(startTime, endTime);
      form.setValue("hoursWorked", calculatedHours);
    }
  }, [startTime, endTime, form]);

  // Update total hours when either value changes
  useEffect(() => {
    const hours = manualHoursWorked ?? 
      (startTime && endTime ? calculateHoursFromTime(startTime, endTime) : 0);
    
    if (hours && numberOfResidents) {
      setTotalHours(calculateTotalHours(hours, numberOfResidents));
    } else {
      setTotalHours(null);
    }
  }, [startTime, endTime, manualHoursWorked, numberOfResidents]);

  return {
    form,
    onSubmit,
    totalHours,
    customers,
  };
};
