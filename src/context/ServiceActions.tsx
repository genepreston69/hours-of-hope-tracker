
import { ServiceEntry } from "../models/types";
import { toast } from "../components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

export interface ServiceActionsType {
  addServiceEntry: (entry: ServiceEntry) => Promise<void>;
  deleteServiceEntry: (id: string) => Promise<void>;
  importServiceEntries: (entries: ServiceEntry[]) => Promise<void>;
}

export const createServiceActions = (
  serviceEntries: ServiceEntry[],
  setServiceEntries: React.Dispatch<React.SetStateAction<ServiceEntry[]>>
): ServiceActionsType => {
  
  const addServiceEntry = async (entry: ServiceEntry) => {
    try {
      // Round the total hours to the nearest hour before saving
      const roundedEntry = {
        ...entry,
        totalHours: Math.round(entry.totalHours)
      };
      
      // Transform to Supabase format
      const supabaseEntry = {
        id: roundedEntry.id,
        date: roundedEntry.date.toISOString().split('T')[0],
        customer_id: roundedEntry.customerId,
        facility_location_id: roundedEntry.facilityLocationId,
        volunteer_count: roundedEntry.numberOfResidents,
        hours: roundedEntry.totalHours,
        description: roundedEntry.notes || ''
      };
      
      console.log("Adding service entry to Supabase:", supabaseEntry);
      
      const { error } = await supabase
        .from('service_entries')
        .insert(supabaseEntry);
      
      if (error) {
        console.error("Supabase error when adding entry:", error);
        throw error;
      }
      
      console.log("Service entry added successfully to Supabase");
      
      setServiceEntries(prev => [...prev, roundedEntry]);
      toast.success("Service entry recorded successfully");
    } catch (error) {
      console.error("Error adding service entry:", error);
      toast.error("Failed to record service entry");
    }
  };

  const deleteServiceEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('service_entries')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setServiceEntries(prev => prev.filter(entry => entry.id !== id));
      toast.success("Service entry deleted");
    } catch (error) {
      console.error("Error deleting service entry:", error);
      toast.error("Failed to delete service entry");
    }
  };

  const importServiceEntries = async (newEntries: ServiceEntry[]) => {
    try {
      console.log("Starting import of service entries:", newEntries);
      
      // First, get facility locations to match location names to UUIDs
      const { data: locationData, error: locationError } = await supabase
        .from('facility_locations')
        .select('id, name');
      
      if (locationError) {
        console.error("Error fetching facility locations:", locationError);
        throw new Error("Could not fetch facility locations for mapping");
      }

      // Create a mapping of location names to UUIDs
      const locationMap = new Map();
      if (locationData) {
        locationData.forEach(loc => {
          locationMap.set(loc.name.toLowerCase(), loc.id);
        });
      }
      
      console.log("Location name to ID mapping:", Object.fromEntries([...locationMap.entries()]));
      
      // Transform to Supabase format with proper location IDs
      const supabaseEntries = newEntries.map(entry => {
        console.log("Processing entry:", entry);
        
        // Try to find the UUID for the location name
        const locationId = locationMap.get(entry.facilityLocationId.toLowerCase());
        
        if (!locationId) {
          console.warn(`No UUID found for location "${entry.facilityLocationId}". Creating entry with string value.`);
        }
        
        return {
          id: entry.id,
          date: entry.date.toISOString().split('T')[0],
          customer_id: entry.customerId,
          // Use the UUID if found, otherwise use the string name (may fail if DB requires UUID)
          facility_location_id: locationId || entry.facilityLocationId,
          volunteer_count: entry.numberOfResidents,
          hours: Math.round(entry.totalHours),
          description: entry.notes || ''
        };
      });
      
      console.log("Importing service entries to Supabase:", supabaseEntries);
      
      const { error } = await supabase
        .from('service_entries')
        .insert(supabaseEntries);
      
      if (error) {
        console.error("Error importing service entries:", error);
        throw error;
      }
      
      console.log("Import successful. Adding entries to state.");
      
      setServiceEntries(prev => {
        // Filter out duplicates based on id
        const existingIds = new Set(prev.map(e => e.id));
        const uniqueEntries = newEntries
          .filter(e => !existingIds.has(e.id))
          .map(entry => ({
            ...entry,
            totalHours: Math.round(entry.totalHours)
          }));
        
        toast.success(`Imported ${uniqueEntries.length} service entries`);
        return [...prev, ...uniqueEntries];
      });
    } catch (error) {
      console.error("Error importing service entries:", error);
      toast.error("Failed to import service entries");
    }
  };

  return {
    addServiceEntry,
    deleteServiceEntry,
    importServiceEntries
  };
};
