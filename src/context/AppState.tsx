
import React, { useState, useCallback } from "react";
import { Customer, ServiceEntry, ServiceStats, LocationStats } from "../models/types";
import { AppStateType } from "./AppStateTypes";
import { useDataFetching } from "./useDataFetching";
import { useStatsCalculation } from "./useStatsCalculation";
import { useAuth } from "@/hooks/use-auth";

export { AppStateType } from "./AppStateTypes";

export function useAppState(): [
  AppStateType, 
  React.Dispatch<React.SetStateAction<Customer[]>>, 
  React.Dispatch<React.SetStateAction<ServiceEntry[]>>,
  () => Promise<void>
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
  const { user } = useAuth();

  // Import the data fetching functionality
  const { fetchData } = useDataFetching(user);

  // Manual data refresh function
  const refreshData = useCallback(async () => {
    console.log("Manual data refresh requested");
    setIsLoading(true);
    try {
      const { customers: newCustomers, serviceEntries: newServiceEntries } = await fetchData();
      setCustomers(newCustomers);
      setServiceEntries(newServiceEntries);
    } catch (error) {
      console.error("Error during data refresh:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchData]);

  // Load data from Supabase when user is authenticated
  React.useEffect(() => {
    refreshData();
  }, [refreshData]); // Run this effect when user changes

  // Use the stats calculation hook
  useStatsCalculation(serviceEntries, setStats, setLocationStats);

  return [
    { customers, serviceEntries, stats, locationStats, isLoading },
    setCustomers,
    setServiceEntries,
    refreshData
  ];
}
