
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ServiceEntry } from "@/models/types";
import { formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CalendarClock } from "lucide-react";

// Define filter types
type DateFilter = "mtd" | "ytd";

const Dashboard = () => {
  const { serviceEntries, stats } = useAppContext();
  const [dateFilter, setDateFilter] = useState<DateFilter>("ytd");
  const [filteredEntries, setFilteredEntries] = useState<ServiceEntry[]>([]);
  const [filteredStats, setFilteredStats] = useState(stats);
  const [filteredLocationStats, setFilteredLocationStats] = useState(useAppContext().locationStats);

  // Set document title
  useEffect(() => {
    document.title = "Dashboard | Recovery Resident Service Tracker";
  }, []);

  // Filter data based on selected date range
  useEffect(() => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
    
    let filtered: ServiceEntry[];
    
    if (dateFilter === "mtd") {
      // Month to Date: Only entries from the beginning of the current month
      filtered = serviceEntries.filter(entry => 
        new Date(entry.date) >= firstDayOfMonth
      );
    } else {
      // Year to Date: Only entries from the beginning of the current year
      filtered = serviceEntries.filter(entry => 
        new Date(entry.date) >= firstDayOfYear
      );
    }
    
    // Sort entries by date (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Update filtered entries
    setFilteredEntries(filtered);
    
    // Calculate filtered stats
    if (filtered.length === 0) {
      setFilteredStats({
        totalEntries: 0,
        totalHours: 0,
        totalResidents: 0,
        averageHoursPerResident: 0,
      });
      setFilteredLocationStats([]);
    } else {
      const totalEntries = filtered.length;
      const totalHours = filtered.reduce((sum, entry) => sum + entry.totalHours, 0);
      const totalResidents = filtered.reduce((sum, entry) => sum + entry.numberOfResidents, 0);
      const averageHoursPerResident = totalResidents > 0 ? totalHours / totalResidents : 0;
      
      setFilteredStats({
        totalEntries,
        totalHours,
        totalResidents,
        averageHoursPerResident,
      });
      
      // Calculate location stats from filtered entries
      const locationMap = new Map();
      
      filtered.forEach(entry => {
        if (!locationMap.has(entry.location)) {
          locationMap.set(entry.location, {
            location: entry.location,
            entries: 0,
            hours: 0,
            residents: 0
          });
        }
        
        const locationStat = locationMap.get(entry.location);
        locationStat.entries += 1;
        locationStat.hours += entry.totalHours;
        locationStat.residents += entry.numberOfResidents;
      });
      
      setFilteredLocationStats(Array.from(locationMap.values()));
    }
  }, [serviceEntries, dateFilter]);

  // Get recent entries (top 5)
  const recentEntries = filteredEntries.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild className="mt-2 sm:mt-0">
          <Link to="/service-entry">Enter New Service Hours</Link>
        </Button>
      </div>
      
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">Filter:</span>
          <ToggleGroup type="single" value={dateFilter} onValueChange={(value) => value && setDateFilter(value as DateFilter)}>
            <ToggleGroupItem value="mtd" size="sm">Month to Date</ToggleGroupItem>
            <ToggleGroupItem value="ytd" size="sm">Year to Date</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Service Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{filteredStats.totalHours.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Residents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{filteredStats.totalResidents.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{filteredStats.totalEntries.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Hours per Resident</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{filteredStats.averageHoursPerResident.toFixed(1)}</div>
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
            {filteredLocationStats.length > 0 ? (
              <div className="space-y-4">
                {filteredLocationStats.map((stat) => (
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
                            width: `${Math.min(100, (stat.hours / Math.max(...filteredLocationStats.map(s => s.hours))) * 100)}%` 
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
