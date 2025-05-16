
import { DateFilter, DateFilterType } from "@/components/dashboard/DateFilter";
import { StatCards } from "@/components/dashboard/StatCards";
import { RecentEntries } from "@/components/dashboard/RecentEntries";
import { LocationStats } from "@/components/dashboard/LocationStats";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { DashboardLoader } from "@/components/dashboard/DashboardLoader";
import { EmptyDashboard } from "@/components/dashboard/EmptyDashboard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { useDashboard } from "@/hooks/use-dashboard";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const [dateFilter, setDateFilter] = useState<DateFilterType>("ytd");
  
  // Get dashboard state from the hook
  const { 
    serviceEntries, 
    isLoadingData, 
    refreshing, 
    handleRefresh, 
    refreshData, 
    user
  } = useDashboard();
  
  // Pre-process data outside of render conditions to avoid hook count mismatch
  const dashboardData = useDashboardData(serviceEntries, dateFilter);

  // Show loading state during loading
  if (isLoadingData) {
    return <DashboardLoader />;
  }
  
  // If no entries but not loading, show empty state
  if (serviceEntries.length === 0) {
    return <EmptyDashboard user={user} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <DashboardHeader 
        refreshing={refreshing} 
        onRefresh={handleRefresh} 
        refreshData={refreshData} 
        user={user} 
      />
      
      <DateFilter dateFilter={dateFilter} setDateFilter={setDateFilter} />
      <StatCards stats={dashboardData.filteredStats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentEntries entries={dashboardData.latestEntriesByLocation} />
        <LocationStats locationStats={dashboardData.filteredLocationStats} />
      </div>
    </div>
  );
};

export default Dashboard;
