
import { DateFilter, DateFilterType } from "@/components/dashboard/DateFilter";
import { StatCards } from "@/components/dashboard/StatCards";
import { RecentEntries } from "@/components/dashboard/RecentEntries";
import { LocationStatsCard } from "@/components/dashboard/LocationStats";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { DashboardLoader } from "@/components/dashboard/DashboardLoader";
import { EmptyDashboard } from "@/components/dashboard/EmptyDashboard";
import { TaskNotifications } from "@/components/dashboard/TaskNotifications";
import { useDashboard } from "@/hooks/use-dashboard";
import { useTaskTracking } from "@/hooks/use-task-tracking";
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2 } from "lucide-react";

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
  
  // Get task tracking status
  const taskStatus = useTaskTracking(serviceEntries);
  
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-zinc-50 to-stone-50">
      <div className="container mx-auto p-6">
        <div className="space-y-6 animate-fade-in">
          {/* Header Card with Glass Effect */}
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-6 nav-shadow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Service Dashboard</h1>
                <p className="text-slate-500 mt-1">Track and monitor service hours</p>
              </div>
              <Button 
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing}
                className="mt-4 sm:mt-0 bg-white/50 backdrop-blur-sm border-slate-200/60 hover:bg-white/70"
              >
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
            </div>
          </div>
          
          {/* Task Notifications - Show at top for authenticated users */}
          <TaskNotifications taskStatus={taskStatus} user={user} />
          
          {/* Date Filter Card */}
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-6 nav-shadow">
            <DateFilter dateFilter={dateFilter} setDateFilter={setDateFilter} />
          </div>

          {/* Stats Cards */}
          <StatCards stats={dashboardData.filteredStats} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentEntries 
              entries={dashboardData.latestEntriesByLocation} 
              allFilteredEntries={dashboardData.allFilteredEntries}
              dateFilter={dateFilter}
            />
            <LocationStatsCard locationStats={dashboardData.filteredLocationStats} />
          </div>
          
          {/* Pagination functionality is preserved but UI elements are removed */}
          {/* The loadMore and pagination state are still available for other uses */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
