
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
  const [hoursWorked, setHoursWorked] = useState<number | null>(null);
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

      // Calculate hours from time fields (required)
      const calculatedHours = calculateHoursFromTime(data.startTime, data.endTime);
      const calculatedTotalHours = calculateTotalHours(calculatedHours, data.numberOfResidents);

      const serviceEntry = {
        id: uuidv4(),
        date: data.date,
        customerId: data.customerId,
        customerName: customer.name,
        facilityLocationId: locationId,
        location: data.facilityLocationId,
        hoursWorked: calculatedHours,
        numberOfResidents: data.numberOfResidents,
        totalHours: calculatedTotalHours,
        notes: data.notes || "",
        startTime: data.startTime,
        endTime: data.endTime,
        createdAt: new Date(),
      };

      console.log("Submitting service entry:", serviceEntry);
      await addServiceEntry(serviceEntry);
      
      console.log("Service entry submitted successfully");
      
      form.reset({
        date: new Date(),
        customerId: "",
        facilityLocationId: undefined,
        startTime: "",
        endTime: "",
        numberOfResidents: undefined,
        notes: "",
      });
      
      setTotalHours(null);
      setHoursWorked(null);
      
      toast.success("Service entry recorded successfully");
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
  const numberOfResidents = form.watch("numberOfResidents");

  // Update hours worked and total hours when values change
  useEffect(() => {
    if (startTime && endTime) {
      const calculatedHours = calculateHoursFromTime(startTime, endTime);
      setHoursWorked(calculatedHours);
      
      if (numberOfResidents) {
        setTotalHours(calculateTotalHours(calculatedHours, numberOfResidents));
      } else {
        setTotalHours(null);
      }
    } else {
      setHoursWorked(null);
      setTotalHours(null);
    }
  }, [startTime, endTime, numberOfResidents]);

  return {
    form,
    onSubmit,
    totalHours,
    hoursWorked,
    customers,
    isSubmitting
  };
};
