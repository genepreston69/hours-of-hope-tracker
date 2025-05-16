
import { useCallback } from "react";
import { Customer, ServiceEntry } from "../models/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "../components/ui/sonner";
import { User } from "@supabase/supabase-js";

export const useDataFetching = (user: User | null) => {
  // Function to fetch data from Supabase
  const fetchData = useCallback(async () => {
    if (!user) {
      console.log("No user authenticated, skipping data fetch");
      return { customers: [], serviceEntries: [] };
    }

    console.log("User authenticated, fetching data from Supabase...");
    
    try {
      // Fetch customers
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('*');
      
      if (customersError) {
        console.error("Error fetching customers:", customersError);
        throw customersError;
      }

      console.log(`Fetched ${customersData?.length || 0} customers from Supabase`);

      // Transform Supabase customers to app format
      const transformedCustomers: Customer[] = customersData?.map(customer => ({
        id: customer.id,
        name: customer.name,
        contactName: customer.contact_person || '',
        contactEmail: customer.contact_email || '',
        contactPhone: customer.contact_phone || '',
        street: customer.street || '',
        city: customer.city || '',
        state: customer.state || '',
        zip: customer.zip || ''
      })) || [];
      
      // Fetch service entries
      const { data: entriesData, error: entriesError } = await supabase
        .from('service_entries')
        .select('*, customers(name)');
      
      if (entriesError) {
        console.error("Error fetching service entries:", entriesError);
        throw entriesError;
      }

      console.log(`Fetched ${entriesData?.length || 0} service entries from Supabase`);
      console.log("Sample entry data:", entriesData && entriesData.length > 0 ? entriesData[0] : "No entries found");

      // Transform Supabase service entries to app format
      const transformedEntries: ServiceEntry[] = entriesData?.map(entry => ({
        id: entry.id,
        date: new Date(entry.date),
        customerId: entry.customer_id,
        customerName: entry.customers?.name || '',
        facilityLocationId: entry.facility_location_id || '',
        location: entry.facility_location_id || '', // Will need to fetch location name separately
        numberOfResidents: entry.volunteer_count || 0,
        hoursWorked: entry.hours || 0,
        totalHours: entry.hours || 0,
        notes: entry.description || '',
        createdAt: new Date(entry.created_at || new Date())
      })) || [];

      // Fetch facility locations to map IDs to names
      if (transformedEntries.length > 0) {
        const { data: locationsData, error: locationsError } = await supabase
          .from('facility_locations')
          .select('*');
        
        if (!locationsError && locationsData) {
          console.log(`Fetched ${locationsData.length} facility locations`);
          const locationMap = new Map();
          locationsData.forEach(loc => {
            locationMap.set(loc.id, loc.name);
          });
          
          // Update service entries with location names
          const entriesWithLocations = transformedEntries.map(entry => ({
            ...entry,
            location: locationMap.get(entry.facilityLocationId) || entry.facilityLocationId
          }));
          
          return { customers: transformedCustomers, serviceEntries: entriesWithLocations };
        } else {
          return { customers: transformedCustomers, serviceEntries: transformedEntries };
        }
      } else {
        return { customers: transformedCustomers, serviceEntries: [] };
      }
      
    } catch (error) {
      console.error("Error fetching data from Supabase:", error);
      toast.error("Failed to load data from the database. Please try again later.");
      throw error;
    }
  }, [user]);

  return { fetchData };
};
