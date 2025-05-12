
import { ServiceEntry } from "../models/types";
import { toast } from "../components/ui/sonner";

export interface ServiceActionsType {
  addServiceEntry: (entry: ServiceEntry) => void;
  deleteServiceEntry: (id: string) => void;
  importServiceEntries: (entries: ServiceEntry[]) => void;
}

export const createServiceActions = (
  serviceEntries: ServiceEntry[],
  setServiceEntries: React.Dispatch<React.SetStateAction<ServiceEntry[]>>
): ServiceActionsType => {
  
  const addServiceEntry = (entry: ServiceEntry) => {
    // Round the total hours to the nearest hour before saving
    const roundedEntry = {
      ...entry,
      totalHours: Math.round(entry.totalHours)
    };
    
    setServiceEntries(prev => [...prev, roundedEntry]);
    toast.success("Service entry recorded successfully");
  };

  const deleteServiceEntry = (id: string) => {
    setServiceEntries(prev => prev.filter(entry => entry.id !== id));
    toast.success("Service entry deleted");
  };

  const importServiceEntries = (newEntries: ServiceEntry[]) => {
    setServiceEntries(prev => {
      // Filter out duplicates based on id and round total hours
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
  };

  return {
    addServiceEntry,
    deleteServiceEntry,
    importServiceEntries
  };
};
