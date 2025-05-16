
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

const Dashboard = () => {
  const { serviceEntries, isLoading, refreshData } = useAppContext();
  const [dateFilter, setDateFilter] = useState<DateFilterType>("ytd");
  const [refreshing, setRefreshing] = useState(false);
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
      console.log("User is authenticated on Dashboard:", user.email);
    } else {
      console.log("No authenticated user on Dashboard - showing public view");
    }
    console.log(`Dashboard has ${serviceEntries.length} service entries`);
  }, [user, serviceEntries]);

  // Auto-refresh data when component mounts
  useEffect(() => {
    if (refreshData && !isLoading) {
      console.log("Auto refreshing dashboard data on mount");
      handleRefresh();
    }
  }, []);

  // Function to manually refresh data
  const handleRefresh = async () => {
    if (refreshing) return;
    
    setRefreshing(true);
    try {
      if (refreshData) {
        await refreshData();
        toast.success("Data refreshed successfully");
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh data");
    } finally {
      setRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-lg">Loading data from database...</p>
        </div>
      </div>
    );
  }
  
  // If no entries but not loading, show empty state
  if (serviceEntries.length === 0 && !isLoading) {
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
