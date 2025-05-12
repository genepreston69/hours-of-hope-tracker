
import { Customer } from "../models/types";
import { toast } from "../components/ui/sonner";

export interface CustomerActionsType {
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, updatedCustomer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => boolean;
  importCustomers: (customers: Customer[]) => void;
  getCustomerById: (id: string) => Customer | undefined;
}

export const createCustomerActions = (
  customers: Customer[],
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>,
  serviceEntries: any[]
): CustomerActionsType => {
  
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

  const importCustomers = (newCustomers: Customer[]) => {
    setCustomers(prev => {
      // Filter out duplicates based on id
      const existingIds = new Set(prev.map(c => c.id));
      const uniqueCustomers = newCustomers.filter(c => !existingIds.has(c.id));
      toast.success(`Imported ${uniqueCustomers.length} customers`);
      return [...prev, ...uniqueCustomers];
    });
  };

  const getCustomerById = (id: string) => {
    return customers.find(customer => customer.id === id);
  };

  return {
    addCustomer,
    updateCustomer,
    deleteCustomer,
    importCustomers,
    getCustomerById
  };
};
