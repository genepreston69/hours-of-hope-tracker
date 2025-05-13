
import { Customer } from "../models/types";
import { toast } from "../components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

export interface CustomerActionsType {
  addCustomer: (customer: Customer) => Promise<void>;
  updateCustomer: (id: string, updatedCustomer: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<boolean>;
  importCustomers: (customers: Customer[]) => Promise<void>;
  getCustomerById: (id: string) => Customer | undefined;
}

export const createCustomerActions = (
  customers: Customer[],
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>,
  serviceEntries: any[]
): CustomerActionsType => {
  
  const addCustomer = async (customer: Customer) => {
    try {
      // Transform to Supabase format
      const supabaseCustomer = {
        id: customer.id,
        name: customer.name,
        contact_person: customer.contactName || '',
        contact_email: customer.contactEmail || null,
        contact_phone: customer.contactPhone || null,
        street: customer.street || null,
        city: customer.city || null,
        state: customer.state || null,
        zip: customer.zip || null
      };
      
      const { error } = await supabase
        .from('customers')
        .insert(supabaseCustomer);
        
      if (error) throw error;
      
      setCustomers(prev => [...prev, customer]);
      toast.success("Customer added successfully");
    } catch (error) {
      console.error("Error adding customer:", error);
      toast.error("Failed to add customer");
    }
  };

  const updateCustomer = async (id: string, updatedCustomer: Partial<Customer>) => {
    try {
      // Transform to Supabase format
      const supabaseCustomer: Record<string, any> = {};
      
      if (updatedCustomer.name) supabaseCustomer.name = updatedCustomer.name;
      if (updatedCustomer.contactName !== undefined) supabaseCustomer.contact_person = updatedCustomer.contactName || '';
      if (updatedCustomer.contactEmail !== undefined) supabaseCustomer.contact_email = updatedCustomer.contactEmail || null;
      if (updatedCustomer.contactPhone !== undefined) supabaseCustomer.contact_phone = updatedCustomer.contactPhone || null;
      if (updatedCustomer.street !== undefined) supabaseCustomer.street = updatedCustomer.street || null;
      if (updatedCustomer.city !== undefined) supabaseCustomer.city = updatedCustomer.city || null;
      if (updatedCustomer.state !== undefined) supabaseCustomer.state = updatedCustomer.state || null;
      if (updatedCustomer.zip !== undefined) supabaseCustomer.zip = updatedCustomer.zip || null;
      
      const { error } = await supabase
        .from('customers')
        .update(supabaseCustomer)
        .eq('id', id);
      
      if (error) throw error;
      
      setCustomers(prev => 
        prev.map(customer => 
          customer.id === id ? { ...customer, ...updatedCustomer } : customer
        )
      );
      toast.success("Customer updated successfully");
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error("Failed to update customer");
    }
  };

  const deleteCustomer = async (id: string) => {
    // Check if customer has any service entries
    const hasEntries = serviceEntries.some(entry => entry.customerId === id);
    
    if (hasEntries) {
      toast.error("Cannot delete customer with existing service entries");
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setCustomers(prev => prev.filter(customer => customer.id !== id));
      toast.success("Customer deleted");
      return true;
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("Failed to delete customer");
      return false;
    }
  };

  const importCustomers = async (newCustomers: Customer[]) => {
    try {
      // Transform to Supabase format
      const supabaseCustomers = newCustomers.map(customer => ({
        id: customer.id,
        name: customer.name,
        contact_person: customer.contactName || null,
        contact_email: customer.contactEmail || null,
        contact_phone: customer.contactPhone || null,
        street: customer.street || null,
        city: customer.city || null,
        state: customer.state || null,
        zip: customer.zip || null
      }));
      
      const { error } = await supabase
        .from('customers')
        .insert(supabaseCustomers);
      
      if (error) throw error;
      
      setCustomers(prev => {
        // Filter out duplicates based on id
        const existingIds = new Set(prev.map(c => c.id));
        const uniqueCustomers = newCustomers.filter(c => !existingIds.has(c.id));
        toast.success(`Imported ${uniqueCustomers.length} customers`);
        return [...prev, ...uniqueCustomers];
      });
    } catch (error) {
      console.error("Error importing customers:", error);
      toast.error("Failed to import customers");
    }
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
