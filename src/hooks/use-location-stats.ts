import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LocationStats } from "@/models/types";
import { DateFilterType } from "@/components/dashboard/DateFilter";

export const useLocationStats = (dateFilter: DateFilterType) => {
  const [locationStats, setLocationStats] = useState<LocationStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocationStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`🏢 Fetching location stats from Supabase view for filter: ${dateFilter}`);
      
      // For views, we need to use a raw query since the view isn't in the TypeScript types
      const { data, error } = await supabase
        .from('location_hours_summary')
        .select(`
          facility_location_id,
          mtd_hours,
          ytd_hours,
          ly_mtd_hours,
          ly_ytd_hours,
          facility_locations(name)
        `);

      if (error) {
        console.error('❌ Error fetching location stats:', error);
        setError(error.message || 'Error fetching stats');
      }

      // Transform the data for the component
      const transformedStats: LocationStats[] = data?.map((row: any) => {
        // Determine which hours value to use based on the dateFilter
        let hours = 0;
        let lastYearHours = 0;
        
        if (dateFilter === "mtd") {
          hours = Number(row.mtd_hours || 0);
          lastYearHours = Number(row.ly_mtd_hours || 0);
        } else if (dateFilter === "ytd") {
          hours = Number(row.ytd_hours || 0);
          lastYearHours = Number(row.ly_ytd_hours || 0);
        } else if (dateFilter === "ly_mtd") {
          hours = Number(row.ly_mtd_hours || 0);
        } else if (dateFilter === "ly_ytd") {
          hours = Number(row.ly_ytd_hours || 0);
        }

        return {
          location: row.facility_locations.name,
          hours: hours,
          lastYearHours: lastYearHours,
          // These values aren't available in the view, so we'll set defaults
          entries: 0,
          residents: 0
        };
      }) || [];

      // Sort by hours in descending order
      transformedStats.sort((a, b) => b.hours - a.hours);

      console.log(`✅ Fetched ${transformedStats.length} location stats from Supabase view:`, transformedStats);
      setLocationStats(transformedStats);
    } catch (error) {
      console.error('❌ Error fetching location stats:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats when dateFilter changes
  useEffect(() => {
    fetchLocationStats();
  }, [dateFilter]);

  return {
    locationStats,
    loading,
    error,
    refetch: fetchLocationStats
  };
};