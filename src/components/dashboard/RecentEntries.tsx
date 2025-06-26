
import { ServiceEntry } from "@/models/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Last Service Entry by Location</CardTitle>
            <CardDescription>Most recent service entry for each location</CardDescription>
          </div>
          {allFilteredEntries && allFilteredEntries.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportToCSV}
              className="shrink-0"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {entries.length > 0 ? (
          <div className="space-y-4">
            {entries.map((entry: ServiceEntry) => (
              <div key={entry.id} className="flex flex-col gap-1 p-3 border rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium">{entry.customerName}</span>
                  <span className="text-muted-foreground">{formatDate(entry.date)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Location: {entry.location}</span>
                  <span>{Math.round(entry.totalHours)} hours ({entry.numberOfResidents} volunteers)</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No service entries yet.</p>
        )}
      </CardContent>
    </Card>
  );
};
