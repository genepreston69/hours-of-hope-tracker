
import { ServiceEntry } from "@/models/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

interface RecentEntriesProps {
  entries: ServiceEntry[];
}

export const RecentEntries = ({ entries }: RecentEntriesProps) => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Last Service Entry by Location</CardTitle>
        <CardDescription>Most recent service entry for each location</CardDescription>
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
