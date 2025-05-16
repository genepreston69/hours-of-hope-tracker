
import React, { createContext, useContext } from "react";
import { Customer, ServiceEntry, ServiceStats, LocationStats } from "../models/types";
import { useAppState, AppStateType } from "./AppState";
import { createCustomerActions, CustomerActionsType } from "./CustomerActions";
import { createServiceActions, ServiceActionsType } from "./ServiceActions";

interface AppContextExtendedType extends AppStateType, CustomerActionsType, ServiceActionsType {
  refreshData: () => Promise<void>;
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
  const [{ customers, serviceEntries, stats, locationStats, isLoading }, setCustomers, setServiceEntries, refreshData] = useAppState();
  
  const customerActions = createCustomerActions(customers, setCustomers, serviceEntries);
  const serviceActions = createServiceActions(serviceEntries, setServiceEntries, refreshData);

  // Create a more consistent refreshData function that ensures all data is refreshed
  const handleRefreshData = async () => {
    console.log("AppContext: Refreshing all data");
    try {
      await refreshData();
      console.log("AppContext: Data refresh completed successfully");
    } catch (error) {
      console.error("AppContext: Error refreshing data:", error);
      throw error;
    }
  };

  const value: AppContextExtendedType = {
    // State
    customers,
    serviceEntries,
    stats,
    locationStats,
    isLoading,
    
    // Customer actions
    ...customerActions,
    
    // Service actions
    ...serviceActions,
    
    // Data refresh function with better consistency
    refreshData: handleRefreshData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
