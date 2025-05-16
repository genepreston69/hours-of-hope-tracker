
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { DateFilter, DateFilterType } from "@/components/dashboard/DateFilter";
import { StatCards } from "@/components/dashboard/StatCards";
import { RecentEntries } from "@/components/dashboard/RecentEntries";
import { LocationStatsCard } from "@/components/dashboard/LocationStats";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { Loader2, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/components/ui/sonner";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { serviceEntries, isLoading: contextLoading, refreshData } = useAppContext();
  const [dateFilter, setDateFilter] = useState<DateFilterType>("ytd");
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const { user } = useAuth();
  
  const { filteredStats, filteredLocationStats, latestEntriesByLocation } = useDashboardData(
    serviceEntries,
    dateFilter
  );

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

  // Auto-refresh data when component mounts
  useEffect(() => {
    const refreshDashboardData = async () => {
      if (refreshData && !refreshing) {
        setRefreshing(true);
        try {
          console.log("Dashboard: Auto refreshing data on mount");
          await refreshData();
          console.log("Dashboard: Data refresh completed");
        } catch (error) {
          console.error("Dashboard: Error refreshing data on mount:", error);
          toast.error("Failed to refresh data");
        } finally {
          setRefreshing(false);
          setInitialLoad(false);
        }
      }
    };
    
    refreshDashboardData();
  }, [refreshData]);

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
  const isLoadingData = initialLoad || contextLoading || refreshing;

  // Show a persistent loading state during loading
  if (isLoadingData) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h1 className="text-3xl font-bold">Service Community</h1>
          <div className="h-10 w-40">
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        
        <div className="h-12">
          <Skeleton className="h-full w-full" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24">
              <Skeleton className="h-full w-full" />
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="h-64">
            <Skeleton className="h-full w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  // If no entries but not loading, show empty state
  if (serviceEntries.length === 0 && !isLoadingData) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h1 className="text-3xl font-bold">Service Community</h1>
          {user ? (
            <Button asChild className="mt-2 sm:mt-0">
              <Link to="/service-entry">Enter New Service Hours</Link>
            </Button>
          ) : (
            <Button asChild className="mt-2 sm:mt-0">
              <Link to="/auth">Sign In to Enter Hours</Link>
            </Button>
          )}
        </div>
        
        <div className="flex items-center justify-center h-[40vh] flex-col space-y-4 border rounded-lg p-10 bg-muted/20">
          <p className="text-xl">Welcome to Service Community</p>
          <p className="text-muted-foreground text-center">
            {user 
              ? "Add your first service entry to see your dashboard stats" 
              : "Sign in to access all features and record volunteer service hours"}
          </p>
          {user ? (
            <Button asChild>
              <Link to="/service-entry">Add Service Entry</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">Service Community</h1>
          <Button 
            variant="outline" 
            size="icon"
            className="rounded-full"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh data</span>
          </Button>
        </div>
        <div className="flex gap-2 mt-2 sm:mt-0">
          {refreshData && user && (
            <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
              {refreshing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Data
                </>
              )}
            </Button>
          )}
          {user ? (
            <Button asChild>
              <Link to="/service-entry">Enter New Service Hours</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link to="/auth">Sign In to Enter Hours</Link>
            </Button>
          )}
        </div>
      </div>
      
      <DateFilter dateFilter={dateFilter} setDateFilter={setDateFilter} />
      <StatCards stats={filteredStats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentEntries entries={latestEntriesByLocation} />
        <LocationStatsCard locationStats={filteredLocationStats} />
      </div>
    </div>
  );
};

export default Dashboard;
