
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
// import { ReportFilters } from "@/components/reports/ReportFilters";
import { ReportTabs } from "@/components/reports/ReportTabs";
import { EmptyReportState } from "@/components/reports/EmptyReportState";
import { useReportData } from "@/components/reports/useReportData";
import { useIncidentReports } from "@/hooks/use-incident-reports";
import { exportToCSV } from "@/components/reports/ReportExport";

const Reports = () => {
  const { serviceEntries, deleteServiceEntry, refreshData } = useAppContext();
  const { incidentReports, deleteIncidentReport } = useIncidentReports();
  
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
  
  // Handler for CSV export
  const handleExportToCSV = () => {
    exportToCSV(sortedEntries, filters);
  };

  const hasData = sortedEntries.length > 0 || incidentReports.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          {sortedEntries.length > 0 && (
            <Button onClick={handleExportToCSV} className="mt-2 sm:mt-0">
              <Download className="h-4 w-4 mr-2" />
              Export to CSV
            </Button>
          )}
        </div>
      </div>

      {/* Report Filters card removed - saved for later use */}
      {/* 
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg">
        <ReportFilters 
          filters={filters}
          setFilters={setFilters}
          locations={locations}
          customerNames={customerNames}
          onResetFilters={handleResetFilters}
        />
      </div>
      */}

      {hasData ? (
        <ReportTabs 
          currentTab={currentTab || "service-entries"}
          setCurrentTab={setCurrentTab}
          sortedEntries={sortedEntries}
          entriesByLocation={entriesByLocation}
          entriesByCustomer={entriesByCustomer}
          deleteServiceEntry={deleteServiceEntry}
          filters={filters}
          incidentReports={incidentReports}
          deleteIncidentReport={deleteIncidentReport}
        />
      ) : (
        <EmptyReportState onResetFilters={handleResetFilters} />
      )}
    </div>
  );
};

export default Reports;
