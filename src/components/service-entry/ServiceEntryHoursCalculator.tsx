
import { useState, useEffect } from "react";

interface ServiceEntryHoursCalculatorProps {
  startTime: string;
  endTime: string;
  manualHoursWorked?: number;
  numberOfResidents?: number;
  onHoursWorkedChange?: (hours: number) => void;
  onTotalHoursChange?: (totalHours: number | null) => void;
}

const ServiceEntryHoursCalculator: React.FC<ServiceEntryHoursCalculatorProps> = ({
  startTime,
  endTime,
  manualHoursWorked,
  numberOfResidents,
  onHoursWorkedChange,
  onTotalHoursChange
}) => {
  const [totalHours, setTotalHours] = useState<number | null>(null);

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

  // Update hours worked when time changes
  useEffect(() => {
    if (startTime && endTime) {
      const calculatedHours = calculateHoursFromTime(startTime, endTime);
      if (onHoursWorkedChange) {
        onHoursWorkedChange(calculatedHours);
      }
    }
  }, [startTime, endTime, onHoursWorkedChange]);

  // Update total hours when either value changes
  useEffect(() => {
    const hours = manualHoursWorked ?? 
      (startTime && endTime ? calculateHoursFromTime(startTime, endTime) : 0);
    
    if (hours && numberOfResidents) {
      const calculatedTotal = calculateTotalHours(hours, numberOfResidents);
      setTotalHours(calculatedTotal);
      if (onTotalHoursChange) {
        onTotalHoursChange(calculatedTotal);
      }
    } else {
      setTotalHours(null);
      if (onTotalHoursChange) {
        onTotalHoursChange(null);
      }
    }
  }, [startTime, endTime, manualHoursWorked, numberOfResidents, onTotalHoursChange]);

  // This component doesn't render anything
  return null;
};

export default ServiceEntryHoursCalculator;
