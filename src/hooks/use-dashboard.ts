
import { useState, useEffect, useRef } from "react";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/components/ui/sonner";
import { useLocation } from "react-router-dom";

export const useDashboard = () => {
  const location = useLocation();
  const { serviceEntries, isLoading: contextLoading, refreshData } = useAppContext();
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const isMountedRef = useRef(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  
  // Get forceRefresh parameter from location state
  const forceRefresh = location.state?.forceRefresh || false;
  
  // Set document title and clean up
  useEffect(() => {
    document.title = "Dashboard | Service Community";
    
    // Reset the forceRefresh state parameter after it's been used
    if (forceRefresh && history.replaceState) {
      const newState = { ...location.state };
      delete newState.forceRefresh;
      history.replaceState(newState, '');
    }
    
    // Clean up function
    return () => {
      isMountedRef.current = false;
    };
  }, [forceRefresh, location.state]);

  // Only handle forced refresh, don't trigger additional data loads
  useEffect(() => {
    const handleForceRefresh = async () => {
      if (forceRefresh && refreshData) {
        console.log('Dashboard: Handling forced refresh');
        
        try {
          setRefreshing(true);
          await refreshData();
          console.log('Dashboard: Forced refresh completed');
        } catch (error) {
          console.error('Dashboard: Error during forced refresh:', error);
          if (isMountedRef.current) {
            toast.error("Failed to refresh dashboard data");
          }
        } finally {
          if (isMountedRef.current) {
            setRefreshing(false);
          }
        }
      }
    };
    
    handleForceRefresh();
  }, [forceRefresh, refreshData]);

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

  // Simple loading check - don't add additional complexity
  const isLoadingData = contextLoading;

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
