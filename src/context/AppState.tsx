
import React, { useState, useCallback, useRef } from "react";
import { Customer, ServiceEntry, ServiceStats, LocationStats } from "../models/types";
import { AppStateType } from "./AppStateTypes";
import { useDataFetching } from "./useDataFetching";
import { useStatsCalculation } from "./useStatsCalculation";
import { useAuth } from "@/hooks/use-auth";

// Use 'export type' for re-exporting types when isolatedModules is enabled
export type { AppStateType } from "./AppStateTypes";

export function useAppState(): [
  AppStateType, 
  React.Dispatch<React.SetStateAction<Customer[]>>, 
  React.Dispatch<React.SetStateAction<ServiceEntry[]>>,
  (page?: number) => Promise<void>
] {
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
  const [totalPages, setTotalPages] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { user } = useAuth();
  const initialLoadRef = useRef(false);

  // Import the data fetching functionality
  const { fetchData } = useDataFetching(user);

  // Manual data refresh function
  const refreshData = useCallback(async (page?: number) => {
    console.log(`Manual data refresh requested for page: ${page || 1}`);
    setIsLoading(true);
    
    try {
      const { 
        customers: newCustomers, 
        serviceEntries: newServiceEntries,
        totalCount,
        hasMore: moreData
      } = await fetchData(page);
      
      if (page && page > 1) {
        // If loading additional pages, append the new entries
        setServiceEntries(prev => {
          // Create a Map with IDs as keys to avoid duplicates
          const entriesMap = new Map(prev.map(entry => [entry.id, entry]));
          
          // Add new entries to the map (will overwrite if duplicate ID)
          newServiceEntries.forEach(entry => {
            entriesMap.set(entry.id, entry);
          });
          
          // Convert map back to array
          return Array.from(entriesMap.values());
        });
      } else {
        // If loading first page or refreshing, replace all data
        setCustomers(newCustomers);
        setServiceEntries(newServiceEntries);
      }
      
      // Calculate and update pagination state - updated for new page size
      const calculatedTotalPages = Math.ceil(totalCount / 2000); // Updated from 1000 to 2000
      setTotalPages(calculatedTotalPages);
      setHasMore(moreData);
      setCurrentPage(page || 1);
      
      console.log(`Updated pagination: current page ${page || 1}, total pages ${calculatedTotalPages}, has more: ${moreData}`);
      
    } catch (error) {
      console.error("Error during data refresh:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchData]);

  // Load data from Supabase when user is authenticated - but only once
  React.useEffect(() => {
    const initialLoad = async () => {
      if (initialLoadRef.current) {
        console.log("Initial load already completed, skipping...");
        return;
      }
      
      initialLoadRef.current = true;
      setIsLoading(true);
      
      try {
        console.log("Starting initial data load...");
        const { 
          customers: initialCustomers, 
          serviceEntries: initialEntries,
          totalCount,
          hasMore: moreData
        } = await fetchData();
        
        setCustomers(initialCustomers);
        setServiceEntries(initialEntries);
        
        // Calculate and update pagination state - updated for new page size
        setTotalPages(Math.ceil(totalCount / 2000)); // Updated from 1000 to 2000
        setHasMore(moreData);
        
        console.log("Initial data load completed successfully");
      } catch (error) {
        console.error("Error during initial data load:", error);
        initialLoadRef.current = false; // Reset on error so it can retry
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      initialLoad();
    }
  }, [user]); // Only depend on user, not fetchData

  // Use the stats calculation hook
  useStatsCalculation(serviceEntries, setStats, setLocationStats);

  return [
    { 
      customers, 
      serviceEntries, 
      stats, 
      locationStats, 
      isLoading,
      pagination: {
        currentPage,
        totalPages,
        hasMore
      }
    },
    setCustomers,
    setServiceEntries,
    refreshData
  ];
}
