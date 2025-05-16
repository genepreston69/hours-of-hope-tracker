
import { useState, useEffect, useRef } from "react";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/components/ui/sonner";

export const useDashboard = () => {
  const { serviceEntries, isLoading: contextLoading, refreshData } = useAppContext();
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [stableLoading, setStableLoading] = useState(true);
  const { user } = useAuth();
  const refreshAttemptedRef = useRef(false);
  
  // Set document title
  useEffect(() => {
    document.title = "Dashboard | Service Community";
  }, []);

  // Log state to help with debugging
  useEffect(() => {
    if (user) {
      console.log("Dashboard: User is authenticated:", user.email);
    } else {
      console.log("Dashboard: No authenticated user - showing public view");
    }
    console.log(`Dashboard: Has ${serviceEntries.length} service entries`);
  }, [user, serviceEntries]);

  // Auto-refresh data when component mounts with debounce to prevent flashing
  useEffect(() => {
    let isMounted = true;
    
    const refreshDashboardData = async () => {
      // Only refresh if not already refreshing and not already attempted
      if (refreshData && !refreshing && !refreshAttemptedRef.current) {
        refreshAttemptedRef.current = true;
        setRefreshing(true);
        
        try {
          console.log("Dashboard: Auto refreshing data on mount");
          await refreshData();
          console.log("Dashboard: Data refresh completed");
        } catch (error) {
          console.error("Dashboard: Error refreshing data on mount:", error);
          if (isMounted) {
            toast.error("Failed to refresh data");
          }
        } finally {
          // Use a small timeout to prevent UI flashing
          setTimeout(() => {
            if (isMounted) {
              setRefreshing(false);
              setInitialLoad(false);
              setStableLoading(false);
            }
          }, 300);
        }
      } else if (!refreshing) {
        // If we can't refresh, still update loading states
        setTimeout(() => {
          if (isMounted) {
            setInitialLoad(false);
            setStableLoading(false);
          }
        }, 300);
      }
    };
    
    refreshDashboardData();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [refreshData, refreshing]);

  // Function to manually refresh data
  const handleRefresh = async () => {
    if (refreshing) return;
    
    setRefreshing(true);
    try {
      console.log("Dashboard: Manual refresh initiated");
      if (refreshData) {
        await refreshData();
        toast.success("Data refreshed successfully");
        console.log("Dashboard: Manual refresh completed");
      }
    } catch (error) {
      console.error("Dashboard: Error refreshing data:", error);
      toast.error("Failed to refresh data");
    } finally {
      setRefreshing(false);
    }
  };

  // Enhanced loading check to ensure we wait for both initial and context loading
  const isLoadingData = stableLoading || contextLoading || refreshing;

  return {
    serviceEntries,
    isLoadingData,
    refreshing,
    handleRefresh,
    refreshData,
    user
  };
};
