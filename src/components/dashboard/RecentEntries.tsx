
import { ServiceEntry } from "@/models/types";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { exportToCSV } from "@/components/reports/ReportExport";
import { DateFilterType } from "@/components/dashboard/DateFilter";

interface RecentEntriesProps {
  entries: ServiceEntry[];
  allFilteredEntries?: ServiceEntry[];
  dateFilter?: DateFilterType;
}

export const RecentEntries = ({ entries, allFilteredEntries, dateFilter }: RecentEntriesProps) => {
  const handleExportToCSV = () => {
    if (!allFilteredEntries || allFilteredEntries.length === 0) return;
    
    // Create filters object for the export function
    const filters = {
      location: "all",
      customer: "all",
      dateFrom: undefined,
      dateTo: undefined,
    };
    
    exportToCSV(allFilteredEntries, filters, dateFilter);
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-lg">
      <div className="p-6 border-b border-white/10">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 tracking-tight">Last Service Entry by Location</h3>
            <p className="text-sm text-slate-500 mt-1">Most recent service entry for each location</p>
          </div>
          {allFilteredEntries && allFilteredEntries.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportToCSV}
              className="shrink-0 bg-white/50 backdrop-blur-sm border-white/30 hover:bg-white/70"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          )}
        </div>
      </div>
      <div className="p-6">
        {entries.length > 0 ? (
          <div className="space-y-4">
            {entries.map((entry: ServiceEntry) => (
              <div key={entry.id} className="bg-gradient-to-r from-slate-50/80 to-zinc-50/80 backdrop-blur-sm border border-slate-200/40 rounded-xl p-4 hover:from-slate-50 hover:to-zinc-50 transition-all duration-200">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-slate-900">{entry.customerName}</span>
                  <span className="text-sm text-slate-500 bg-white/60 px-2 py-1 rounded-lg">{formatDate(entry.date)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-slate-700">Location: {entry.location}</span>
                  <span className="text-slate-600 bg-white/40 px-2 py-1 rounded-lg">{Math.round(entry.totalHours)} hours ({entry.numberOfResidents} volunteers)</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-center py-8">No service entries yet.</p>
        )}
      </div>
    </div>
  );
};
