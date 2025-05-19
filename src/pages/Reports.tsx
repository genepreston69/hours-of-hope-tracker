
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { StatCards } from "@/components/reports/StatCards";
import { ReportTabs } from "@/components/reports/ReportTabs";
import { EmptyReportState } from "@/components/reports/EmptyReportState";
import { useReportData } from "@/components/reports/useReportData";
import { exportToCSV } from "@/components/reports/ReportExport";

const Reports = () => {
  const { serviceEntries, deleteServiceEntry, refreshData } = useAppContext();
  
  const {
    currentTab,
    setCurrentTab,
    refreshing,
    setRefreshing,
    filters,
    setFilters,
    locations,
    customerNames,
    sortedEntries,
    totalHours,
    totalResidents,
    avgHoursPerResident,
    entriesByLocation,
    entriesByCustomer,
    handleResetFilters,
  } = useReportData(serviceEntries, refreshData);
  
  // Function to refresh data manually
  const handleRefresh = async () => {
    if (refreshing || !refreshData) return;
    
    setRefreshing(true);
    try {
      console.log("Reports: Manual refresh initiated");
      await refreshData();
      toast.success("Report data refreshed");
      console.log("Reports: Manual refresh completed");
    } catch (error) {
      console.error("Reports: Error refreshing report data:", error);
      toast.error("Failed to refresh report data");
    } finally {
      setRefreshing(false);
    }
  };
  
  // Handler for CSV export
  const handleExportToCSV = () => {
    exportToCSV(sortedEntries, filters);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-bold">Service Reports</h1>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          {refreshData && (
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
          {sortedEntries.length > 0 && (
            <Button onClick={handleExportToCSV} className="mt-2 sm:mt-0">
              <Download className="h-4 w-4 mr-2" />
              Export to CSV
            </Button>
          )}
        </div>
      </div>

      <ReportFilters 
        filters={filters}
        setFilters={setFilters}
        locations={locations}
        customerNames={customerNames}
        onResetFilters={handleResetFilters}
      />

      {sortedEntries.length > 0 ? (
        <>
          <StatCards 
            totalHours={totalHours}
            totalResidents={totalResidents}
            avgHoursPerResident={avgHoursPerResident}
          />

          <ReportTabs 
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            sortedEntries={sortedEntries}
            entriesByLocation={entriesByLocation}
            entriesByCustomer={entriesByCustomer}
            deleteServiceEntry={deleteServiceEntry}
            filters={filters}
          />
        </>
      ) : (
        <EmptyReportState onResetFilters={handleResetFilters} />
      )}
    </div>
  );
};

export default Reports;
