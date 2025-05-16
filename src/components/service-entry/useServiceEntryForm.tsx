
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/sonner";
import { useAppContext } from "@/context/AppContext";
import { v4 as uuidv4 } from "uuid";
import { formSchema, ServiceEntryFormValues } from "./types";
import { getLocationIdByName } from "@/constants/locations";
import { useNavigate } from "react-router-dom";

export const useServiceEntryForm = () => {
  const { customers, addServiceEntry, getCustomerById } = useAppContext();
  const [totalHours, setTotalHours] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

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

  const onSubmit = async (data: ServiceEntryFormValues) => {
    setIsSubmitting(true);
    
    try {
      const customer = getCustomerById(data.customerId);
      if (!customer) {
        toast.error("Selected customer not found");
        setIsSubmitting(false);
        return;
      }

      // Get the location ID from the location name
      const locationId = getLocationIdByName(data.facilityLocationId);
      if (!locationId) {
        toast.error(`Could not find location ID for ${data.facilityLocationId}`);
        setIsSubmitting(false);
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
        id: uuidv4(), // Use proper UUID generation
        date: data.date,
        customerId: data.customerId,
        customerName: customer.name,
        facilityLocationId: locationId, // Use the UUID instead of the name
        location: data.facilityLocationId, // Keep the location name for display
        hoursWorked: hoursWorked,
        numberOfResidents: data.numberOfResidents,
        totalHours: calculatedTotalHours,
        notes: data.notes || "",
        startTime: data.startTime || null,
        endTime: data.endTime || null,
        createdAt: new Date(),
      };

      await addServiceEntry(serviceEntry);
      
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
      
      // Show success message
      toast.success("Service entry recorded and data refreshed");
      
      // Navigate to dashboard to see the updated data
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting service entry:", error);
      toast.error("Failed to record service entry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
    isSubmitting
  };
};
