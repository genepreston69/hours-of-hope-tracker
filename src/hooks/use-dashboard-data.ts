
import { useEffect, useState } from "react";
import { LocationStats, ServiceEntry, ServiceStats } from "@/models/types";
import { DateFilterType } from "@/components/dashboard/DateFilter";

export const useDashboardData = (
  serviceEntries: ServiceEntry[],
  dateFilter: DateFilterType
) => {
  const [filteredEntries, setFilteredEntries] = useState<ServiceEntry[]>([]);
  const [filteredStats, setFilteredStats] = useState<ServiceStats>({
    totalEntries: 0,
    totalHours: 0,
    totalResidents: 0,
    averageHoursPerResident: 0,
  });
  const [filteredLocationStats, setFilteredLocationStats] = useState<LocationStats[]>([]);
  const [latestEntriesByLocation, setLatestEntriesByLocation] = useState<ServiceEntry[]>([]);

  useEffect(() => {
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
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Update filtered entries
    setFilteredEntries(filtered);
    
    // Calculate filtered stats
    if (filtered.length === 0) {
      setFilteredStats({
        totalEntries: 0,
        totalHours: 0,
        totalResidents: 0,
        averageHoursPerResident: 0,
      });
      setFilteredLocationStats([]);
      setLatestEntriesByLocation([]);
    } else {
      const totalEntries = filtered.length;
      const totalHours = Math.round(filtered.reduce((sum, entry) => sum + entry.totalHours, 0));
      const totalResidents = filtered.reduce((sum, entry) => sum + entry.numberOfResidents, 0);
      const averageHoursPerResident = totalResidents > 0 ? Math.round(totalHours / totalResidents) : 0;
      
      setFilteredStats({
        totalEntries,
        totalHours,
        totalResidents,
        averageHoursPerResident,
      });
      
      // Calculate location stats from filtered entries
      const locationMap = new Map();
      
      filtered.forEach(entry => {
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
      
      setFilteredLocationStats(Array.from(locationMap.values()));
      
      // Find the latest entry for each location
      const latestByLocation = new Map<string, ServiceEntry>();
      
      filtered.forEach(entry => {
        if (!entry.location) return;
        
        if (!latestByLocation.has(entry.location) || 
            new Date(entry.date) > new Date(latestByLocation.get(entry.location)!.date)) {
          latestByLocation.set(entry.location, entry);
        }
      });
      
      setLatestEntriesByLocation(Array.from(latestByLocation.values()));
    }
  }, [serviceEntries, dateFilter]);

  // Get recent entries (top 5)
  const recentEntries = filteredEntries.slice(0, 5);

  return {
    filteredStats,
    filteredLocationStats,
    recentEntries,
    latestEntriesByLocation
  };
};
