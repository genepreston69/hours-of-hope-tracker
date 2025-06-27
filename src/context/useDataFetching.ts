
import { useCallback } from "react";
import { Customer, ServiceEntry } from "../models/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "../components/ui/sonner";
import { User } from "@supabase/supabase-js";

// Define pagination constants
const PAGE_SIZE = 2000; // Increased from 1000 to 2000 to get more historical data
const DEFAULT_PAGE = 1; // Default starting page

export const useDataFetching = (user: User | null) => {
  // Function to fetch data from Supabase with pagination support
  const fetchData = useCallback(async (page = DEFAULT_PAGE) => {
    if (!user) {
      console.log("No user authenticated, skipping data fetch");
      return { customers: [], serviceEntries: [], totalCount: 0, hasMore: false };
    }

    console.log(`User authenticated, fetching data from Supabase (page ${page})...`);
    
    try {
      // Fetch customers (no need for pagination here as they're typically fewer)
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
      
      // Calculate pagination ranges
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      
      // First, get the total count of entries
      const { count, error: countError } = await supabase
        .from('service_entries')
        .select('*', { count: 'exact', head: true });
        
      if (countError) {
        console.error("Error counting service entries:", countError);
        throw countError;
      }
      
      const totalCount = count || 0;
      console.log(`Total service entries in database: ${totalCount}`);
      
      // Fetch service entries with pagination - ordered by date descending to get recent entries first
      const { data: entriesData, error: entriesError } = await supabase
        .from('service_entries')
        .select('*, customers(name)')
        .order('date', { ascending: false })
        .range(from, to);
      
      if (entriesError) {
        console.error("Error fetching service entries:", entriesError);
        throw entriesError;
      }

      console.log(`Fetched ${entriesData?.length || 0} service entries from Supabase (page ${page})`);
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

      // Calculate if there are more pages
      const hasMore = totalCount > (page * PAGE_SIZE);
      console.log(`Has more pages: ${hasMore}, Total pages: ${Math.ceil(totalCount / PAGE_SIZE)}`);

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
          
          return { 
            customers: transformedCustomers, 
            serviceEntries: entriesWithLocations,
            totalCount,
            hasMore
          };
        } else {
          return { 
            customers: transformedCustomers, 
            serviceEntries: transformedEntries,
            totalCount,
            hasMore
          };
        }
      } else {
        return { 
          customers: transformedCustomers, 
          serviceEntries: [],
          totalCount: 0,
          hasMore: false
        };
      }
      
    } catch (error) {
      console.error("Error fetching data from Supabase:", error);
      toast.error("Failed to load data from the database. Please try again later.");
      throw error;
    }
  }, [user]);

  return { fetchData };
};
