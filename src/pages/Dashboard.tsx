
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ServiceEntry } from "@/models/types";
import { formatDate } from "@/lib/utils";
import { useEffect } from "react";

const Dashboard = () => {
  const { serviceEntries, stats, locationStats } = useAppContext();

  // Set document title
  useEffect(() => {
    document.title = "Dashboard | Recovery Resident Service Tracker";
  }, []);

  // Sort entries by date (newest first)
  const recentEntries = [...serviceEntries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild className="mt-2 sm:mt-0">
          <Link to="/service-entry">Enter New Service Hours</Link>
        </Button>
      </div>

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
            <div className="text-3xl font-bold">{stats.averageHoursPerResident.toFixed(1)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Service Entries</CardTitle>
            <CardDescription>The 5 most recent service entries</CardDescription>
          </CardHeader>
          <CardContent>
            {recentEntries.length > 0 ? (
              <div className="space-y-4">
                {recentEntries.map((entry: ServiceEntry) => (
                  <div key={entry.id} className="flex flex-col gap-1 p-3 border rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-medium">{entry.customerName}</span>
                      <span className="text-muted-foreground">{formatDate(entry.date)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Location: {entry.location}</span>
                      <span className="font-medium">{entry.totalHours} hours ({entry.numberOfResidents} residents)</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No service entries yet.</p>
            )}
          </CardContent>
        </Card>

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
      </div>
    </div>
  );
};

export default Dashboard;
