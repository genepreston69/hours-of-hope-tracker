
import React, { createContext, useContext } from "react";
import { Customer, ServiceEntry, ServiceStats, LocationStats } from "../models/types";
import { useAppState, AppStateType } from "./AppState";
import { createCustomerActions, CustomerActionsType } from "./CustomerActions";
import { createServiceActions, ServiceActionsType } from "./ServiceActions";
import { useUserOrganization } from "@/hooks/use-user-organization";
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
  const { organizationId } = useUserOrganization();
  
  const customerActions = createCustomerActions(customers, setCustomers, serviceEntries, organizationId);
  const serviceActions = createServiceActions(serviceEntries, setServiceEntries, refreshData, organizationId);

  // Create a consistent refreshData function that ensures all data is refreshed
  const handleRefreshData = async (page?: number) => {
    console.log(`AppContext: Refreshing data${page ? ` for page ${page}` : ''}`);
    try {
      await refreshData(page);
      console.log("AppContext: Data refresh completed successfully");
    } catch (error) {
      console.error("AppContext: Error refreshing data:", error);
      toast.error("Failed to refresh data from the server");
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
    pagination,
    
    // Customer actions
    ...customerActions,
    
    // Service actions
    ...serviceActions,
    
    // Data refresh function
    refreshData: handleRefreshData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
