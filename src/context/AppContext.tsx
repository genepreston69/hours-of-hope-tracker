
import React, { createContext, useContext } from "react";
import { Customer, ServiceEntry, ServiceStats, LocationStats } from "../models/types";
import { useAppState, AppStateType } from "./AppState";
import { createCustomerActions, CustomerActionsType } from "./CustomerActions";
import { createServiceActions, ServiceActionsType } from "./ServiceActions";

interface AppContextType extends AppStateType, CustomerActionsType, ServiceActionsType {}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [{ customers, serviceEntries, stats, locationStats }, setCustomers, setServiceEntries] = useAppState();
  
  const customerActions = createCustomerActions(customers, setCustomers, serviceEntries);
  const serviceActions = createServiceActions(serviceEntries, setServiceEntries);

  const value: AppContextType = {
    // State
    customers,
    serviceEntries,
    stats,
    locationStats,
    
    // Customer actions
    ...customerActions,
    
    // Service actions
    ...serviceActions
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
