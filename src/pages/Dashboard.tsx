
import { useState } from "react";
import { DateFilter, DateFilterType } from "@/components/dashboard/DateFilter";
import { StatCards } from "@/components/dashboard/StatCards";
import { RecentEntries } from "@/components/dashboard/RecentEntries";
import { LocationStatsCard } from "@/components/dashboard/LocationStats";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { DashboardLoader } from "@/components/dashboard/DashboardLoader";
import { EmptyDashboard } from "@/components/dashboard/EmptyDashboard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { useDashboard } from "@/hooks/use-dashboard";

const Dashboard = () => {
  const [dateFilter, setDateFilter] = useState<DateFilterType>("ytd");
  const { 
    serviceEntries, 
    isLoadingData, 
    refreshing, 
    handleRefresh, 
    refreshData, 
    user
  } = useDashboard();
  
  const { filteredStats, filteredLocationStats, latestEntriesByLocation } = useDashboardData(
    serviceEntries,
    dateFilter
  );

  // Show a persistent loading state during loading
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
      <StatCards stats={filteredStats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentEntries entries={latestEntriesByLocation} />
        <LocationStatsCard locationStats={filteredLocationStats} />
      </div>
    </div>
  );
};

export default Dashboard;
