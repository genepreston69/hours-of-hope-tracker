
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardsProps {
  totalHours: number;
  totalResidents: number;
  avgHoursPerResident: number;
}

export const StatCards = ({ totalHours, totalResidents, avgHoursPerResident }: StatCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Service Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalHours.toLocaleString()}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Residents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalResidents.toLocaleString()}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Hours per Resident</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{avgHoursPerResident.toFixed(1)}</div>
        </CardContent>
      </Card>
    </div>
  );
};
