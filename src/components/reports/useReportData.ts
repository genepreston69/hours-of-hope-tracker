
import { useState, useEffect } from "react";
import { ServiceEntry } from "@/models/types";
import { ReportFilters } from "./ReportFilters";

export const useReportData = (
  serviceEntries: ServiceEntry[],
  refreshData: (() => Promise<void>) | undefined
) => {
  const [currentTab, setCurrentTab] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<ReportFilters>({
    location: "all",
    customer: "all",
    dateFrom: undefined,
    dateTo: undefined,
  });

  // Auto-refresh data when component mounts
  useEffect(() => {
    const refreshReportData = async () => {
      if (refreshData) {
        setRefreshing(true);
        try {
          console.log("Reports: Auto refreshing report data on mount");
          await refreshData();
          console.log("Reports: Data refresh completed");
        } catch (error) {
          console.error("Reports: Error refreshing data on mount:", error);
        } finally {
          setRefreshing(false);
        }
      }
    };
    
    refreshReportData();
  }, [refreshData]);

  // Extract unique locations and customers for filtering
  const locations = Array.from(new Set(serviceEntries.map((entry) => entry.location)));
  const customerNames = Array.from(
    new Set(serviceEntries.map((entry) => entry.customerName))
  );

  // Apply filters to service entries
  const filteredEntries = serviceEntries.filter((entry) => {
    // Filter by location
    if (filters.location !== "all" && entry.location !== filters.location) {
      return false;
    }

    // Filter by customer
    if (filters.customer !== "all" && entry.customerName !== filters.customer) {
      return false;
    }

    // Filter by date range
    if (filters.dateFrom && new Date(entry.date) < filters.dateFrom) {
      return false;
    }

    if (filters.dateTo && new Date(entry.date) > filters.dateTo) {
      return false;
    }

    return true;
  });

  // Sort entries by date (newest first)
  const sortedEntries = [...filteredEntries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Calculate summary statistics for filtered data
  const totalHours = sortedEntries.reduce((sum, entry) => sum + entry.totalHours, 0);
  const totalResidents = sortedEntries.reduce((sum, entry) => sum + entry.numberOfResidents, 0);

  // Calculate average hours per resident
  const avgHoursPerResident = totalResidents > 0 ? totalHours / totalResidents : 0;

  // Group entries by location for location report
  const entriesByLocation = locations.map((location) => {
    const locationEntries = sortedEntries.filter((entry) => entry.location === location);
    const locationHours = locationEntries.reduce((sum, entry) => sum + entry.totalHours, 0);
    const locationResidents = locationEntries.reduce((sum, entry) => sum + entry.numberOfResidents, 0);

    return {
      location,
      entries: locationEntries.length,
      hours: locationHours,
      residents: locationResidents,
    };
  });

  // Group entries by customer for customer report
  const entriesByCustomer = customerNames.map((customer) => {
    const customerEntries = sortedEntries.filter((entry) => entry.customerName === customer);
    const customerHours = customerEntries.reduce((sum, entry) => sum + entry.totalHours, 0);
    const customerResidents = customerEntries.reduce((sum, entry) => sum + entry.numberOfResidents, 0);

    return {
      customer,
      entries: customerEntries.length,
      hours: customerHours,
      residents: customerResidents,
    };
  });

  const handleResetFilters = () => {
    setFilters({
      location: "all",
      customer: "all",
      dateFrom: undefined,
      dateTo: undefined,
    });
  };

  return {
    currentTab,
    setCurrentTab,
    refreshing,
    setRefreshing,
    filters,
    setFilters,
    locations,
    customerNames,
    sortedEntries,
    totalHours,
    totalResidents,
    avgHoursPerResident,
    entriesByLocation,
    entriesByCustomer,
    handleResetFilters,
  };
};
