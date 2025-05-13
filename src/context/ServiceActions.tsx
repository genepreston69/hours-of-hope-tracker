
import { ServiceEntry } from "../models/types";
import { toast } from "../components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { getLocationIdByName } from "@/constants/locations";

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

      // Each entry should already have a valid UUID for facilityLocationId
      
      // Transform to Supabase format
      const supabaseEntries = newEntries.map(entry => {
        console.log("Processing entry for import:", entry);
        
        // Verify that the ID is a valid UUID format
        if (!entry.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
          throw new Error(`Invalid UUID format for entry: ${entry.id}`);
        }
        
        // Verify that facilityLocationId is a valid UUID
        if (!entry.facilityLocationId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
          throw new Error(`Invalid UUID format for location ID: ${entry.facilityLocationId}`);
        }
        
        return {
          id: entry.id,
          date: entry.date.toISOString().split('T')[0],
          customer_id: entry.customerId,
          facility_location_id: entry.facilityLocationId,
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
      toast.error(`Failed to import service entries: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  return {
    addServiceEntry,
    deleteServiceEntry,
    importServiceEntries
  };
};
