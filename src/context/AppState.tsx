
import React, { useState, useEffect } from "react";
import { Customer, ServiceEntry, ServiceStats, LocationStats } from "../models/types";
import { toast } from "../components/ui/sonner";

export interface AppStateType {
  customers: Customer[];
  serviceEntries: ServiceEntry[];
  stats: ServiceStats;
  locationStats: LocationStats[];
}

export function useAppState(): [AppStateType, React.Dispatch<React.SetStateAction<Customer[]>>, React.Dispatch<React.SetStateAction<ServiceEntry[]>>] {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [serviceEntries, setServiceEntries] = useState<ServiceEntry[]>([]);
  const [stats, setStats] = useState<ServiceStats>({
    totalEntries: 0,
    totalHours: 0,
    totalResidents: 0,
    averageHoursPerResident: 0,
  });
  const [locationStats, setLocationStats] = useState<LocationStats[]>([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      const storedCustomers = localStorage.getItem("customers");
      const storedEntries = localStorage.getItem("serviceEntries");
      
      if (storedCustomers) {
        setCustomers(JSON.parse(storedCustomers));
      }
      
      if (storedEntries) {
        // Convert string dates back to Date objects
        const parsedEntries = JSON.parse(storedEntries).map((entry: any) => ({
          ...entry,
          date: new Date(entry.date),
          createdAt: new Date(entry.createdAt)
        }));
        setServiceEntries(parsedEntries);
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      toast.error("Failed to load saved data");
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("customers", JSON.stringify(customers));
      localStorage.setItem("serviceEntries", JSON.stringify(serviceEntries));
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
    }
  }, [customers, serviceEntries]);

  // Calculate statistics whenever service entries change
  useEffect(() => {
    if (serviceEntries.length === 0) {
      setStats({
        totalEntries: 0,
        totalHours: 0,
        totalResidents: 0,
        averageHoursPerResident: 0,
      });
      setLocationStats([]);
      return;
    }

    const totalEntries = serviceEntries.length;
    const totalHours = serviceEntries.reduce((sum, entry) => sum + entry.totalHours, 0);
    const totalResidents = serviceEntries.reduce((sum, entry) => sum + entry.numberOfResidents, 0);
    const averageHoursPerResident = totalResidents > 0 ? totalHours / totalResidents : 0;

    setStats({
      totalEntries,
      totalHours,
      totalResidents,
      averageHoursPerResident,
    });

    // Calculate location stats
    const locationMap = new Map<string, LocationStats>();
    
    serviceEntries.forEach(entry => {
      if (!locationMap.has(entry.location)) {
        locationMap.set(entry.location, {
          location: entry.location,
          entries: 0,
          hours: 0,
          residents: 0
        });
      }
      
      const locationStat = locationMap.get(entry.location)!;
      locationStat.entries += 1;
      locationStat.hours += entry.totalHours;
      locationStat.residents += entry.numberOfResidents;
    });
    
    setLocationStats(Array.from(locationMap.values()));
  }, [serviceEntries]);

  return [
    { customers, serviceEntries, stats, locationStats },
    setCustomers,
    setServiceEntries
  ];
}
