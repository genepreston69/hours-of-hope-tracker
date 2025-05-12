import React, { createContext, useContext, useState, useEffect } from "react";
import { Customer, ServiceEntry, ServiceStats, LocationStats } from "../models/types";
import { toast } from "../components/ui/sonner";

interface AppContextType {
  customers: Customer[];
  serviceEntries: ServiceEntry[];
  stats: ServiceStats;
  locationStats: LocationStats[];
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, updatedCustomer: Partial<Customer>) => void;
  addServiceEntry: (entry: ServiceEntry) => void;
  importCustomers: (customers: Customer[]) => void;
  importServiceEntries: (entries: ServiceEntry[]) => void;
  getCustomerById: (id: string) => Customer | undefined;
  deleteServiceEntry: (id: string) => void;
  deleteCustomer: (id: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [serviceEntries, setServiceEntries] = useState<ServiceEntry[]>([]);
  const [stats, setStats] = useState<ServiceStats>({
    totalEntries: 0,
    totalHours: 0,
    totalResidents: 0,
    averageHoursPerResident: 0,
  });
  const [locationStats, setLocationStats] = useState<LocationStats[]>([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      const storedCustomers = localStorage.getItem("customers");
      const storedEntries = localStorage.getItem("serviceEntries");
      
      if (storedCustomers) {
        setCustomers(JSON.parse(storedCustomers));
      }
      
      if (storedEntries) {
        // Convert string dates back to Date objects
        const parsedEntries = JSON.parse(storedEntries).map((entry: any) => ({
          ...entry,
          date: new Date(entry.date),
          createdAt: new Date(entry.createdAt)
        }));
        setServiceEntries(parsedEntries);
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      toast.error("Failed to load saved data");
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("customers", JSON.stringify(customers));
      localStorage.setItem("serviceEntries", JSON.stringify(serviceEntries));
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
    }
  }, [customers, serviceEntries]);

  // Calculate statistics whenever service entries change
  useEffect(() => {
    if (serviceEntries.length === 0) {
      setStats({
        totalEntries: 0,
        totalHours: 0,
        totalResidents: 0,
        averageHoursPerResident: 0,
      });
      setLocationStats([]);
      return;
    }

    const totalEntries = serviceEntries.length;
    const totalHours = serviceEntries.reduce((sum, entry) => sum + entry.totalHours, 0);
    const totalResidents = serviceEntries.reduce((sum, entry) => sum + entry.numberOfResidents, 0);
    const averageHoursPerResident = totalResidents > 0 ? totalHours / totalResidents : 0;

    setStats({
      totalEntries,
      totalHours,
      totalResidents,
      averageHoursPerResident,
    });

    // Calculate location stats
    const locationMap = new Map<string, LocationStats>();
    
    serviceEntries.forEach(entry => {
      if (!locationMap.has(entry.location)) {
        locationMap.set(entry.location, {
          location: entry.location,
          entries: 0,
          hours: 0,
          residents: 0
        });
      }
      
      const locationStat = locationMap.get(entry.location)!;
      locationStat.entries += 1;
      locationStat.hours += entry.totalHours;
      locationStat.residents += entry.numberOfResidents;
    });
    
    setLocationStats(Array.from(locationMap.values()));
  }, [serviceEntries]);

  const addCustomer = (customer: Customer) => {
    setCustomers(prev => [...prev, customer]);
    toast.success("Customer added successfully");
  };

  const updateCustomer = (id: string, updatedCustomer: Partial<Customer>) => {
    setCustomers(prev => 
      prev.map(customer => 
        customer.id === id ? { ...customer, ...updatedCustomer } : customer
      )
    );
    toast.success("Customer updated successfully");
  };

  const addServiceEntry = (entry: ServiceEntry) => {
    setServiceEntries(prev => [...prev, entry]);
    toast.success("Service entry recorded successfully");
  };

  const importCustomers = (newCustomers: Customer[]) => {
    setCustomers(prev => {
      // Filter out duplicates based on id
      const existingIds = new Set(prev.map(c => c.id));
      const uniqueCustomers = newCustomers.filter(c => !existingIds.has(c.id));
      toast.success(`Imported ${uniqueCustomers.length} customers`);
      return [...prev, ...uniqueCustomers];
    });
  };

  const importServiceEntries = (newEntries: ServiceEntry[]) => {
    setServiceEntries(prev => {
      // Filter out duplicates based on id
      const existingIds = new Set(prev.map(e => e.id));
      const uniqueEntries = newEntries.filter(e => !existingIds.has(e.id));
      toast.success(`Imported ${uniqueEntries.length} service entries`);
      return [...prev, ...uniqueEntries];
    });
  };

  const getCustomerById = (id: string) => {
    return customers.find(customer => customer.id === id);
  };

  const deleteServiceEntry = (id: string) => {
    setServiceEntries(prev => prev.filter(entry => entry.id !== id));
    toast.success("Service entry deleted");
  };

  const deleteCustomer = (id: string) => {
    // Check if customer has any service entries
    const hasEntries = serviceEntries.some(entry => entry.customerId === id);
    
    if (hasEntries) {
      toast.error("Cannot delete customer with existing service entries");
      return false;
    }
    
    setCustomers(prev => prev.filter(customer => customer.id !== id));
    toast.success("Customer deleted");
    return true;
  };

  const value = {
    customers,
    serviceEntries,
    stats,
    locationStats,
    addCustomer,
    updateCustomer,
    addServiceEntry,
    importCustomers,
    importServiceEntries,
    getCustomerById,
    deleteServiceEntry,
    deleteCustomer
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
