
import { useMemo } from "react";
import { LocationStats, ServiceEntry, ServiceStats } from "@/models/types";
import { DateFilterType } from "@/components/dashboard/DateFilter";

export const useDashboardData = (
  serviceEntries: ServiceEntry[],
  dateFilter: DateFilterType
) => {
  // Calculate all data using useMemo to avoid unnecessary recalculations
  return useMemo(() => {
    // Default/empty state values
    const emptyStats: ServiceStats = {
      totalEntries: 0,
      totalHours: 0,
      totalResidents: 0,
      averageHoursPerResident: 0,
    };
    
    // If no entries, return empty stats
    if (!serviceEntries || serviceEntries.length === 0) {
      return {
        filteredStats: emptyStats,
        filteredLocationStats: [],
        recentEntries: [],
        latestEntriesByLocation: []
      };
    }
    
    // Filter entries based on date filter
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
    
    let filtered: ServiceEntry[];
    
    if (dateFilter === "mtd") {
      // Month to Date: Only entries from the beginning of the current month
      filtered = serviceEntries.filter(entry => 
        new Date(entry.date) >= firstDayOfMonth
      );
    } else {
      // Year to Date: Only entries from the beginning of the current year
      filtered = serviceEntries.filter(entry => 
        new Date(entry.date) >= firstDayOfYear
      );
    }
    
    // Sort entries by date (newest first)
    const sortedEntries = [...filtered].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Calculate filtered stats
    const totalEntries = sortedEntries.length;
    const totalHours = Math.round(sortedEntries.reduce((sum, entry) => sum + entry.totalHours, 0));
    const totalResidents = sortedEntries.reduce((sum, entry) => sum + entry.numberOfResidents, 0);
    const averageHoursPerResident = totalResidents > 0 ? Math.round(totalHours / totalResidents) : 0;
    
    const filteredStats = {
      totalEntries,
      totalHours,
      totalResidents,
      averageHoursPerResident,
    };
    
    // Calculate location stats from filtered entries
    const locationMap = new Map();
    
    sortedEntries.forEach(entry => {
      if (!locationMap.has(entry.location)) {
        locationMap.set(entry.location, {
          location: entry.location,
          entries: 0,
          hours: 0,
          residents: 0
        });
      }
      
      const locationStat = locationMap.get(entry.location);
      locationStat.entries += 1;
      locationStat.hours += entry.totalHours;
      locationStat.residents += entry.numberOfResidents;
    });
    
    // Round hours in location stats
    locationMap.forEach(stat => {
      stat.hours = Math.round(stat.hours);
    });
    
    const filteredLocationStats = Array.from(locationMap.values());
    
    // Find the latest entry for each location
    const latestByLocation = new Map<string, ServiceEntry>();
    
    sortedEntries.forEach(entry => {
      if (!entry.location) return;
      
      if (!latestByLocation.has(entry.location) || 
          new Date(entry.date) > new Date(latestByLocation.get(entry.location)!.date)) {
        latestByLocation.set(entry.location, entry);
      }
    });
    
    const latestEntriesByLocation = Array.from(latestByLocation.values());
    
    // Get recent entries (top 5)
    const recentEntries = sortedEntries.slice(0, 5);
    
    return {
      filteredStats,
      filteredLocationStats,
      recentEntries,
      latestEntriesByLocation
    };
  }, [serviceEntries, dateFilter]); // Only recalculate when these dependencies change
};
