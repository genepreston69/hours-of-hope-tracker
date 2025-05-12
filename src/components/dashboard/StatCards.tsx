
import { ServiceStats } from "@/models/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardsProps {
  stats: ServiceStats;
}

export const StatCards = ({ stats }: StatCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Service Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.totalHours.toLocaleString()}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Residents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.totalResidents.toLocaleString()}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.totalEntries.toLocaleString()}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Hours per Resident</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.averageHoursPerResident.toFixed(0)}</div>
        </CardContent>
      </Card>
    </div>
  );
};
