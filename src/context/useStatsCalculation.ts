
import { useEffect } from "react";
import { ServiceEntry, ServiceStats, LocationStats } from "../models/types";

export const useStatsCalculation = (
  serviceEntries: ServiceEntry[],
  setStats: (stats: ServiceStats) => void,
  setLocationStats: (locationStats: LocationStats[]) => void
) => {
  // Calculate statistics whenever service entries change
  useEffect(() => {
    console.log(`Calculating stats from ${serviceEntries.length} service entries`);
    
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
    const totalHours = serviceEntries.reduce((sum, entry) => sum + (entry.totalHours || 0), 0);
    const totalResidents = serviceEntries.reduce((sum, entry) => sum + (entry.numberOfResidents || 0), 0);
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
      locationStat.hours += entry.totalHours || 0;
      locationStat.residents += entry.numberOfResidents || 0;
    });
    
    setLocationStats(Array.from(locationMap.values()));
  }, [serviceEntries, setStats, setLocationStats]);
};
