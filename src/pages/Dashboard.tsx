
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { DateFilter, DateFilterType } from "@/components/dashboard/DateFilter";
import { StatCards } from "@/components/dashboard/StatCards";
import { RecentEntries } from "@/components/dashboard/RecentEntries";
import { LocationStatsCard } from "@/components/dashboard/LocationStats";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const Dashboard = () => {
  const { serviceEntries, isLoading } = useAppContext();
  const [dateFilter, setDateFilter] = useState<DateFilterType>("ytd");
  const { user } = useAuth();
  
  const { filteredStats, filteredLocationStats, latestEntriesByLocation } = useDashboardData(
    serviceEntries,
    dateFilter
  );

  // Set document title
  useEffect(() => {
    document.title = "Dashboard | Recovery Volunteer Service Tracker";
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
          <h1 className="text-3xl font-bold">Recovery Volunteer Service Tracker</h1>
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
          <p className="text-xl">Welcome to the Recovery Volunteer Service Tracker</p>
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
        <h1 className="text-3xl font-bold">Recovery Volunteer Service Tracker</h1>
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
