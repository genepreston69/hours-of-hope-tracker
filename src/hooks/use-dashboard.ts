
import { useState, useEffect, useRef } from "react";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/components/ui/sonner";

export const useDashboard = () => {
  const { serviceEntries, isLoading: contextLoading, refreshData } = useAppContext();
  const [refreshing, setRefreshing] = useState(false);
  const [stableLoading, setStableLoading] = useState(true);
  const { user } = useAuth();
  const initialLoadCompletedRef = useRef(false);
  const isMountedRef = useRef(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  
  // Set document title
  useEffect(() => {
    document.title = "Dashboard | Service Community";
    
    // Clean up function
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Controlled initial data loading
  useEffect(() => {
    const loadDashboardData = async () => {
      // Only refresh if not already completed and we have a refresh function
      if (!initialLoadCompletedRef.current && refreshData) {
        console.log("Dashboard: Initial data load started");
        initialLoadCompletedRef.current = true;
        
        try {
          setRefreshing(true);
          await refreshData();
          console.log("Dashboard: Initial data load completed");
        } catch (error) {
          console.error("Dashboard: Error during initial load:", error);
          if (isMountedRef.current) {
            toast.error("Failed to load dashboard data");
          }
        } finally {
          // Only update state if component is still mounted
          if (isMountedRef.current) {
            setRefreshing(false);
            setStableLoading(false);
          }
        }
      } else if (!refreshing) {
        // If we don't need to refresh but are still in loading state, update it
        setStableLoading(false);
      }
    };
    
    loadDashboardData();
  }, [refreshData]);

  // Update logging for debugging
  useEffect(() => {
    if (user) {
      console.log("Dashboard: User is authenticated:", user.email);
    } else {
      console.log("Dashboard: No authenticated user - showing public view");
    }
    console.log(`Dashboard: Has ${serviceEntries.length} service entries`);
  }, [user, serviceEntries]);

  // Function to manually refresh data
  const handleRefresh = async () => {
    if (refreshing || !isMountedRef.current) return;
    
    setRefreshing(true);
    try {
      console.log("Dashboard: Manual refresh initiated");
      if (refreshData) {
        await refreshData();
        if (isMountedRef.current) {
          toast.success("Dashboard data refreshed");
        }
        console.log("Dashboard: Manual refresh completed");
      }
    } catch (error) {
      console.error("Dashboard: Error refreshing data:", error);
      if (isMountedRef.current) {
        toast.error("Failed to refresh data");
      }
    } finally {
      if (isMountedRef.current) {
        setRefreshing(false);
      }
    }
  };

  // Function to load more data
  const loadMore = async () => {
    if (refreshing || !hasMore || !refreshData) return;
    
    setRefreshing(true);
    try {
      console.log(`Dashboard: Loading page ${currentPage + 1}`);
      const nextPage = currentPage + 1;
      await refreshData(nextPage);
      if (isMountedRef.current) {
        setCurrentPage(nextPage);
      }
    } catch (error) {
      console.error("Dashboard: Error loading more data:", error);
      if (isMountedRef.current) {
        toast.error("Failed to load more data");
      }
    } finally {
      if (isMountedRef.current) {
        setRefreshing(false);
      }
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
    user,
    currentPage,
    setCurrentPage,
    totalPages,
    hasMore,
    loadMore
  };
};
