
import { useEffect } from "react";
import { ServiceEntry, ServiceStats, LocationStats } from "../models/types";

export const useStatsCalculation = (
  serviceEntries: ServiceEntry[],
  setStats: (stats: ServiceStats) => void,
  setLocationStats: (locationStats: LocationStats[]) => void
) => {
  // Calculate statistics whenever service entries change
  useEffect(() => {
    console.log(`🔍 Starting stats calculation for ${serviceEntries.length} service entries`);
    
    if (serviceEntries.length === 0) {
      console.log("🔍 No entries to process, setting empty stats");
      setStats({
        totalEntries: 0,
        totalHours: 0,
        totalResidents: 0,
        averageHoursPerResident: 0,
      });
      setLocationStats([]);
      return;
    }

    try {
      // Process stats calculation with error handling
      const totalEntries = serviceEntries.length;
      let totalHours = 0;
      let totalResidents = 0;
      
      // Process entries with validation
      for (let i = 0; i < serviceEntries.length; i++) {
        const entry = serviceEntries[i];
        try {
          totalHours += Math.max(0, entry.totalHours || 0);
          totalResidents += Math.max(0, entry.numberOfResidents || 0);
        } catch (error) {
          console.warn(`🚨 Error processing entry ${entry.id} in stats calculation:`, error);
        }
      }
      
      const averageHoursPerResident = totalResidents > 0 ? totalHours / totalResidents : 0;

      const calculatedStats = {
        totalEntries,
        totalHours,
        totalResidents,
        averageHoursPerResident,
      };
      
      console.log(`🔍 Stats calculation completed:`, calculatedStats);
      setStats(calculatedStats);

      // Calculate location stats with error handling
      const locationMap = new Map<string, LocationStats>();
      
      serviceEntries.forEach(entry => {
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
          
          const locationStat = locationMap.get(location)!;
          locationStat.entries += 1;
          locationStat.hours += Math.max(0, entry.totalHours || 0);
          locationStat.residents += Math.max(0, entry.numberOfResidents || 0);
        } catch (error) {
          console.warn(`🚨 Error processing location stats for entry ${entry.id}:`, error);
        }
      });
      
      const locationStatsArray = Array.from(locationMap.values());
      console.log(`🔍 Location stats calculation completed for ${locationStatsArray.length} locations`);
      setLocationStats(locationStatsArray);
      
    } catch (error) {
      console.error("🚨 Critical error in stats calculation:", error);
      
      // Set safe fallback stats
      setStats({
        totalEntries: 0,
        totalHours: 0,
        totalResidents: 0,
        averageHoursPerResident: 0,
      });
      setLocationStats([]);
    }
  }, [serviceEntries, setStats, setLocationStats]);
};
