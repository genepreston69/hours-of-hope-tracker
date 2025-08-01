
import { ServiceEntry } from "../models/types";
import { toast } from "../components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { getLocationIdByName } from "@/constants/locations";
import { v4 as uuidv4 } from "uuid";

export interface ServiceActionsType {
  addServiceEntry: (entry: ServiceEntry) => Promise<void>;
  deleteServiceEntry: (id: string) => Promise<void>;
  importServiceEntries: (entries: ServiceEntry[]) => Promise<void>;
}

export const createServiceActions = (
  serviceEntries: ServiceEntry[],
  setServiceEntries: React.Dispatch<React.SetStateAction<ServiceEntry[]>>,
  refreshData: () => Promise<void>,
  organizationId: string | null
): ServiceActionsType => {
  
  const addServiceEntry = async (entry: ServiceEntry) => {
    try {
      if (!organizationId) {
        toast.error("Organization not found. Please try again.");
        return;
      }

      // Generate a proper UUID for the service entry
      const entryId = uuidv4();
      
      // Round the total hours to the nearest hour before saving
      const roundedEntry = {
        ...entry,
        id: entryId, // Use the proper UUID
        totalHours: Math.round(entry.totalHours)
      };
      
      // Transform to Supabase format
      const supabaseEntry = {
        id: entryId, // Use the proper UUID
        date: roundedEntry.date.toISOString().split('T')[0],
        customer_id: roundedEntry.customerId,
        facility_location_id: roundedEntry.facilityLocationId,
        volunteer_count: roundedEntry.numberOfResidents,
        hours: roundedEntry.totalHours,
        description: roundedEntry.notes || '',
        organization_id: organizationId
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
      
      // Immediately update the local state with the new entry
      setServiceEntries(prev => [...prev, roundedEntry]);
      
      // Always refresh data to ensure consistency across the app
      console.log("Explicitly refreshing data after service entry submission");
      await refreshData();
      
      console.log("Data refreshed after submission");
    } catch (error) {
      console.error("Error adding service entry:", error);
      toast.error("Failed to record service entry");
      throw error; // Re-throw to allow the form to handle the error
    }
  };

  const deleteServiceEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('service_entries')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state first for immediate UI feedback
      setServiceEntries(prev => prev.filter(entry => entry.id !== id));
      
      // Then refresh data to ensure consistency across the app
      console.log("Refreshing data after deletion");
      await refreshData();
      
      toast.success("Service entry deleted");
    } catch (error) {
      console.error("Error deleting service entry:", error);
      toast.error("Failed to delete service entry");
    }
  };

  const importServiceEntries = async (newEntries: ServiceEntry[]) => {
    try {
      console.log("Starting import of service entries:", newEntries);

      // Transform to Supabase format
      const supabaseEntries = newEntries.map(entry => {
        console.log("Processing entry for import:", entry);
        
        // Verify that the ID is a valid UUID format
        if (!entry.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
          throw new Error(`Invalid UUID format for entry: ${entry.id}`);
        }
        
        // Ensure location is a valid UUID (or map from name if needed)
        let locationId = entry.facilityLocationId;
        if (typeof locationId === 'string' && !locationId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
          locationId = getLocationIdByName(locationId) || '';
          if (!locationId) {
            throw new Error(`Invalid location name: ${entry.facilityLocationId}`);
          }
        }
        
        return {
          id: entry.id,
          date: entry.date.toISOString().split('T')[0],
          customer_id: entry.customerId,
          facility_location_id: locationId,
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
      
      // Always refresh data after import to ensure consistency
      console.log("Refreshing data after import");
      await refreshData();
      
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
