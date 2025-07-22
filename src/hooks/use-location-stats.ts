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
      console.log(`🏢 Fetching location stats from Supabase for filter: ${dateFilter}`);
      
      const { data, error } = await supabase.rpc('get_location_stats_with_date_filter', {
        date_filter_type: dateFilter
      });

      if (error) {
        console.error('❌ Error fetching location stats:', error);
        setError(error.message);
        return;
      }

      const transformedStats: LocationStats[] = data?.map((row: any) => ({
        location: row.location_name,
        hours: Number(row.total_hours),
        residents: Number(row.total_residents),
        entries: Number(row.entry_count)
      })) || [];

      console.log(`✅ Fetched ${transformedStats.length} location stats from Supabase:`, transformedStats);
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