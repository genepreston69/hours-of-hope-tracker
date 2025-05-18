
import React, { createContext, useContext, useEffect } from "react";
import { Customer, ServiceEntry, ServiceStats, LocationStats } from "../models/types";
import { useAppState, AppStateType } from "./AppState";
import { createCustomerActions, CustomerActionsType } from "./CustomerActions";
import { createServiceActions, ServiceActionsType } from "./ServiceActions";
import { toast } from "@/components/ui/sonner";

interface AppContextExtendedType extends AppStateType, CustomerActionsType, ServiceActionsType {
  refreshData: (page?: number) => Promise<void>;
}

const AppContext = createContext<AppContextExtendedType | undefined>(undefined);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [{ customers, serviceEntries, stats, locationStats, isLoading, pagination }, setCustomers, setServiceEntries, refreshData] = useAppState();
  
  const customerActions = createCustomerActions(customers, setCustomers, serviceEntries);
  const serviceActions = createServiceActions(serviceEntries, setServiceEntries, refreshData);

  // Create a more consistent refreshData function that ensures all data is refreshed
  const handleRefreshData = async (page?: number) => {
    console.log(`AppContext: Refreshing all data${page ? ` for page ${page}` : ''}`);
    try {
      await refreshData(page);
      console.log("AppContext: Data refresh completed successfully");
    } catch (error) {
      console.error("AppContext: Error refreshing data:", error);
      toast.error("Failed to refresh data from the server");
      throw error;
    }
  };

  // Auto-refresh data once when the provider mounts
  useEffect(() => {
    const initialDataLoad = async () => {
      try {
        console.log("AppContext: Initial data load");
        await handleRefreshData();
      } catch (error) {
        console.error("AppContext: Error during initial data load:", error);
      }
    };
    
    initialDataLoad();
  }, []);

  const value: AppContextExtendedType = {
    // State
    customers,
    serviceEntries,
    stats,
    locationStats,
    isLoading,
    pagination,
    
    // Customer actions
    ...customerActions,
    
    // Service actions
    ...serviceActions,
    
    // Data refresh function with better consistency
    refreshData: handleRefreshData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
