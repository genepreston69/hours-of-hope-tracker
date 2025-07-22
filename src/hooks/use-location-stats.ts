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
      
      // Query using the existing RPC function for location stats
      const { data, error } = await supabase.rpc('get_location_stats_with_date_filter', {
        date_filter_type: dateFilter
      });

      if (error) {
        console.error('❌ Error fetching location stats:', error);
        setError(error.message);
        return;
      }

      // Transform the data for the component
      const transformedStats: LocationStats[] = data?.map((row: any) => {
        let hours = Number(row.total_hours || 0);
        let lastYearHours = 0;
        
        // For comparison with last year (only applies to current year views)
        if (dateFilter === "mtd" || dateFilter === "ytd") {
          // We don't have last year data in the RPC function yet
          // This would need to be added to the backend function
        }
        
        return {
          location: row.location_name,
          hours: hours,
          lastYearHours: lastYearHours,
          residents: Number(row.total_residents || 0),
          entries: Number(row.entry_count || 0)
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