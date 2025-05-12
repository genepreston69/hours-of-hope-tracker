
import React, { useState, useEffect } from "react";
import { Customer, ServiceEntry, ServiceStats, LocationStats } from "../models/types";
import { toast } from "../components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export interface AppStateType {
  customers: Customer[];
  serviceEntries: ServiceEntry[];
  stats: ServiceStats;
  locationStats: LocationStats[];
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();

  // Load data from Supabase when user is authenticated
  useEffect(() => {
    async function fetchData() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      try {
        // Fetch customers
        const { data: customersData, error: customersError } = await supabase
          .from('customers')
          .select('*');
        
        if (customersError) {
          throw customersError;
        }

        // Transform Supabase customers to app format
        const transformedCustomers: Customer[] = customersData.map(customer => ({
          id: customer.id,
          name: customer.name,
          contactName: customer.contact_person || undefined,
          contactEmail: customer.contact_email || undefined,
          contactPhone: customer.contact_phone || undefined,
          // The address fields don't exist in the Supabase database yet
          street: undefined,
          city: undefined,
          state: undefined,
          zip: undefined
        }));

        setCustomers(transformedCustomers);
        
        // Fetch service entries
        const { data: entriesData, error: entriesError } = await supabase
          .from('service_entries')
          .select(`
            *,
            customers(name)
          `);
        
        if (entriesError) {
          throw entriesError;
        }

        // Transform Supabase service entries to app format
        const transformedEntries: ServiceEntry[] = entriesData.map(entry => ({
          id: entry.id,
          date: new Date(entry.date),
          customerId: entry.customer_id,
          customerName: entry.customers?.name || '',
          facilityLocationId: entry.facility_location_id,
          location: entry.facility_location_id, // Will need to fetch location name separately
          numberOfResidents: entry.volunteer_count,
          hoursWorked: entry.hours,
          totalHours: entry.hours,
          notes: entry.description || undefined,
          createdAt: new Date(entry.created_at)
        }));

        setServiceEntries(transformedEntries);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data from Supabase:", error);
        toast.error("Failed to load data from the database. Please try again later.");
        setIsLoading(false);
      }
    }

    fetchData();
  }, [user]);

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
    { customers, serviceEntries, stats, locationStats, isLoading },
    setCustomers,
    setServiceEntries
  ];
}
