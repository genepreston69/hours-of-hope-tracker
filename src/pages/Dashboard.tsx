
import { DateFilter, DateFilterType } from "@/components/dashboard/DateFilter";
import { StatCards } from "@/components/dashboard/StatCards";
import { RecentEntries } from "@/components/dashboard/RecentEntries";
import { LocationStatsCard } from "@/components/dashboard/LocationStats";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { DashboardLoader } from "@/components/dashboard/DashboardLoader";
import { EmptyDashboard } from "@/components/dashboard/EmptyDashboard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { useDashboard } from "@/hooks/use-dashboard";
import { useState, useEffect } from "react";
import { DashboardPagination } from "@/components/dashboard/DashboardPagination";
import { useAppContext } from "@/context/AppContext";

const Dashboard = () => {
  const [dateFilter, setDateFilter] = useState<DateFilterType>("ytd");
  
  // Get dashboard state from the hook
  const { 
    serviceEntries, 
    isLoadingData, 
    refreshing, 
    handleRefresh, 
    refreshData, 
    user,
    loadMore
  } = useDashboard();
  
  // Get pagination info from context
  const { pagination } = useAppContext();
  
  // Pre-process data outside of render conditions to avoid hook count mismatch
  const dashboardData = useDashboardData(serviceEntries, dateFilter);
  
  // Log when dashboard is rendered/re-rendered for debugging
  useEffect(() => {
    console.log("Dashboard rendered with", serviceEntries.length, "entries, loading:", isLoadingData);
  }, [serviceEntries.length, isLoadingData]);

  // Function to handle page changes
  const handlePageChange = async (page: number) => {
    if (page === pagination.currentPage) return;
    
    // If going to next page, use loadMore function
    if (page === pagination.currentPage + 1) {
      await loadMore();
    } else {
      // Otherwise refresh with specific page
      await refreshData(page);
    }
  };

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
        <LocationStatsCard locationStats={dashboardData.filteredLocationStats} />
      </div>
      
      {/* Pagination controls */}
      <DashboardPagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        hasMore={pagination.hasMore}
        onPageChange={handlePageChange}
        isLoading={isLoadingData || refreshing}
      />
      
      {/* Display data summary */}
      <div className="text-sm text-muted-foreground text-center">
        Showing {serviceEntries.length} service entries 
        {pagination.totalPages > 1 && ` (Page ${pagination.currentPage} of ${pagination.totalPages})`}
      </div>
    </div>
  );
};

export default Dashboard;
