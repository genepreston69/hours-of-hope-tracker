
import { useMemo } from "react";
import { LocationStats, ServiceEntry, ServiceStats } from "@/models/types";
import { DateFilterType } from "@/components/dashboard/DateFilter";

export const useDashboardData = (
  serviceEntries: ServiceEntry[],
  dateFilter: DateFilterType
) => {
  // Calculate all data using useMemo to avoid unnecessary recalculations
  return useMemo(() => {
    console.log(`🔍 Processing ${serviceEntries?.length || 0} service entries for dashboard`);
    
    // Default/empty state values
    const emptyStats: ServiceStats = {
      totalEntries: 0,
      totalHours: 0,
      totalResidents: 0,
      averageHoursPerResident: 0,
    };
    
    // If no entries, return empty stats
    if (!serviceEntries || serviceEntries.length === 0) {
      console.log("🔍 No service entries found, returning empty stats");
      return {
        filteredStats: emptyStats,
        filteredLocationStats: [],
        recentEntries: [],
        latestEntriesByLocation: []
      };
    }
    
    try {
      // Filter entries based on date filter
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
      
      let filtered: ServiceEntry[];
      
      if (dateFilter === "mtd") {
        // Month to Date: Only entries from the beginning of the current month
        filtered = serviceEntries.filter(entry => {
          try {
            return new Date(entry.date) >= firstDayOfMonth;
          } catch (error) {
            console.warn(`🚨 Invalid date found in entry ${entry.id}:`, entry.date);
            return false;
          }
        });
      } else {
        // Year to Date: Only entries from the beginning of the current year
        filtered = serviceEntries.filter(entry => {
          try {
            return new Date(entry.date) >= firstDayOfYear;
          } catch (error) {
            console.warn(`🚨 Invalid date found in entry ${entry.id}:`, entry.date);
            return false;
          }
        });
      }
      
      console.log(`🔍 Filtered to ${filtered.length} entries for ${dateFilter} view`);
      
      // Sort entries by date (newest first) - limit to reduce memory usage
      const sortedEntries = [...filtered]
        .sort((a, b) => {
          try {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          } catch (error) {
            console.warn(`🚨 Error sorting entries:`, error);
            return 0;
          }
        })
        .slice(0, 1000); // Limit to 1000 entries to prevent memory issues
      
      // Calculate filtered stats with error handling
      const totalEntries = sortedEntries.length;
      let totalHours = 0;
      let totalResidents = 0;
      
      // Process entries in batches to avoid blocking the main thread
      for (let i = 0; i < sortedEntries.length; i++) {
        const entry = sortedEntries[i];
        try {
          totalHours += Math.max(0, entry.totalHours || 0);
          totalResidents += Math.max(0, entry.numberOfResidents || 0);
        } catch (error) {
          console.warn(`🚨 Error processing entry ${entry.id}:`, error);
        }
      }
      
      totalHours = Math.round(totalHours);
      const averageHoursPerResident = totalResidents > 0 ? Math.round(totalHours / totalResidents) : 0;
      
      const filteredStats = {
        totalEntries,
        totalHours,
        totalResidents,
        averageHoursPerResident,
      };
      
      console.log(`🔍 Calculated stats:`, filteredStats);
      
      // Calculate location stats from filtered entries with error handling
      const locationMap = new Map();
      
      sortedEntries.forEach(entry => {
        try {
          const location = entry.location || 'Unknown';
          if (!locationMap.has(location)) {
            locationMap.set(location, {
              location,
              entries: 0,
              hours: 0,
              residents: 0
            });
          }
          
          const locationStat = locationMap.get(location);
          locationStat.entries += 1;
          locationStat.hours += Math.max(0, entry.totalHours || 0);
          locationStat.residents += Math.max(0, entry.numberOfResidents || 0);
        } catch (error) {
          console.warn(`🚨 Error processing location stats for entry ${entry.id}:`, error);
        }
      });
      
      // Round hours in location stats
      locationMap.forEach(stat => {
        stat.hours = Math.round(stat.hours);
      });
      
      const filteredLocationStats = Array.from(locationMap.values());
      console.log(`🔍 Calculated location stats for ${filteredLocationStats.length} locations`);
      
      // Find the latest entry for each location with error handling
      const latestByLocation = new Map<string, ServiceEntry>();
      
      sortedEntries.forEach(entry => {
        try {
          const location = entry.location || 'Unknown';
          
          if (!latestByLocation.has(location) || 
              new Date(entry.date) > new Date(latestByLocation.get(location)!.date)) {
            latestByLocation.set(location, entry);
          }
        } catch (error) {
          console.warn(`🚨 Error processing latest entries for location:`, error);
        }
      });
      
      const latestEntriesByLocation = Array.from(latestByLocation.values());
      
      // Get recent entries (top 5)
      const recentEntries = sortedEntries.slice(0, 5);
      
      console.log(`🔍 Dashboard data processing completed successfully`);
      
      return {
        filteredStats,
        filteredLocationStats,
        recentEntries,
        latestEntriesByLocation
      };
      
    } catch (error) {
      console.error("🚨 Error processing dashboard data:", error);
      
      // Return safe fallback data
      return {
        filteredStats: emptyStats,
        filteredLocationStats: [],
        recentEntries: [],
        latestEntriesByLocation: []
      };
    }
  }, [serviceEntries, dateFilter]); // Only recalculate when these dependencies change
};
