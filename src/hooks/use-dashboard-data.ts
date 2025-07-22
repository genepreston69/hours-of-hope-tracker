
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
        latestEntriesByLocation: [],
        allFilteredEntries: []
      };
    }
    
    try {
      // Filter entries based on date filter for overall stats
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
      
      let filtered: ServiceEntry[];
      
      if (dateFilter === "mtd") {
        filtered = serviceEntries.filter(entry => {
          try {
            return new Date(entry.date) >= firstDayOfMonth;
          } catch (error) {
            console.warn(`🚨 Invalid date found in entry ${entry.id}:`, entry.date);
            return false;
          }
        });
      } else if (dateFilter === "ytd") {
        filtered = serviceEntries.filter(entry => {
          try {
            return new Date(entry.date) >= firstDayOfYear;
          } catch (error) {
            console.warn(`🚨 Invalid date found in entry ${entry.id}:`, entry.date);
            return false;
          }
        });
      } else {
        // Default to YTD if unknown filter
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
        .slice(0, 1000);
      
      // Calculate filtered stats with error handling
      const totalEntries = sortedEntries.length;
      let totalHours = 0;
      let totalResidents = 0;
      
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
      
      // NEW APPROACH: Calculate location stats using last 1,000 entries per location
      console.log(`🔍 Starting location-specific processing with last 1,000 entries per location`);
      
      // Step 1: Group all entries by location
      const entriesByLocationMap = new Map<string, ServiceEntry[]>();
      
      serviceEntries.forEach(entry => {
        try {
          const location = entry.location || 'Unknown';
          if (!entriesByLocationMap.has(location)) {
            entriesByLocationMap.set(location, []);
          }
          entriesByLocationMap.get(location)!.push(entry);
        } catch (error) {
          console.warn(`🚨 Error grouping entry by location:`, error);
        }
      });
      
      console.log(`🔍 Grouped entries into ${entriesByLocationMap.size} locations`);
      
      // Step 2: For each location, take last 1,000 entries and apply date filter
      const locationStatsArray: LocationStats[] = [];
      
      entriesByLocationMap.forEach((locationEntries, location) => {
        try {
          // Sort by date (newest first) and take last 1,000 entries
          const last1000Entries = [...locationEntries]
            .sort((a, b) => {
              try {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
              } catch (error) {
                console.warn(`🚨 Error sorting location entries:`, error);
                return 0;
              }
            })
            .slice(0, 1000);
          
          console.log(`🔍 Location "${location}": Using ${last1000Entries.length} entries (from ${locationEntries.length} total)`);
          
          // Apply date filter to this location's 1,000 entries
          let filteredLocationEntries: ServiceEntry[];
          
          if (dateFilter === "mtd") {
            filteredLocationEntries = last1000Entries.filter(entry => {
              try {
                return new Date(entry.date) >= firstDayOfMonth;
              } catch (error) {
                console.warn(`🚨 Invalid date in location entry:`, error);
                return false;
              }
            });
          } else if (dateFilter === "ytd") {
            filteredLocationEntries = last1000Entries.filter(entry => {
              try {
                return new Date(entry.date) >= firstDayOfYear;
              } catch (error) {
                console.warn(`🚨 Invalid date in location entry:`, error);
                return false;
              }
            });
          } else {
            // Default to YTD filtering
            filteredLocationEntries = last1000Entries.filter(entry => {
              try {
                return new Date(entry.date) >= firstDayOfYear;
              } catch (error) {
                console.warn(`🚨 Invalid date in location entry:`, error);
                return false;
              }
            });
          }
          
          console.log(`🔍 Location "${location}": ${filteredLocationEntries.length} entries after ${dateFilter} filter`);
          
          // Calculate stats for this location
          let locationHours = 0;
          let locationResidents = 0;
          
          filteredLocationEntries.forEach(entry => {
            try {
              locationHours += Math.max(0, entry.totalHours || 0);
              locationResidents += Math.max(0, entry.numberOfResidents || 0);
            } catch (error) {
              console.warn(`🚨 Error processing location entry:`, error);
            }
          });
          
          locationHours = Math.round(locationHours);
          
          // Only include locations that have entries in the filtered period
          if (filteredLocationEntries.length > 0) {
            locationStatsArray.push({
              location,
              entries: filteredLocationEntries.length,
              hours: locationHours,
              residents: locationResidents,
            });
          }
          
        } catch (error) {
          console.warn(`🚨 Error processing location "${location}":`, error);
        }
      });
      
      console.log(`🔍 Calculated location stats for ${locationStatsArray.length} locations with data in ${dateFilter} period`);
      
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
        filteredLocationStats: locationStatsArray,
        recentEntries,
        latestEntriesByLocation,
        allFilteredEntries: sortedEntries
      };
      
    } catch (error) {
      console.error("🚨 Error processing dashboard data:", error);
      
      return {
        filteredStats: emptyStats,
        filteredLocationStats: [],
        recentEntries: [],
        latestEntriesByLocation: [],
        allFilteredEntries: []
      };
    }
  }, [serviceEntries, dateFilter]);
};
