
import { LocationStats } from "@/models/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface LocationStatsProps {
  locationStats: LocationStats[];
}

export const LocationStatsCard = ({ locationStats }: LocationStatsProps) => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Service Hours by Location</CardTitle>
        <CardDescription>Total hours for each recovery house location</CardDescription>
      </CardHeader>
      <CardContent>
        {locationStats.length > 0 ? (
          <div className="space-y-4">
            {locationStats.map((stat) => (
              <div key={stat.location} className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{stat.location}</span>
                  <span className="text-sm text-muted-foreground">{stat.entries} entries</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ 
                        width: `${Math.min(100, (stat.hours / Math.max(...locationStats.map(s => s.hours))) * 100)}%` 
                      }}
                    ></div>
                  </div>
                  <span className="ml-2 font-medium">{stat.hours} hrs</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No location data available.</p>
        )}
      </CardContent>
    </Card>
  );
};
