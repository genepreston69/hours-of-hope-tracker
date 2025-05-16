import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils";
import { ServiceEntry } from "@/models/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Download, Calendar, RefreshCw, Loader2 } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";

type ReportFilters = {
  location: string;
  customer: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
};

const Reports = () => {
  const { serviceEntries, customers, locationStats, deleteServiceEntry, refreshData } = useAppContext();
  const [currentTab, setCurrentTab] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<ReportFilters>({
    location: "all",
    customer: "all",
    dateFrom: undefined,
    dateTo: undefined,
  });

  // Auto-refresh data when component mounts
  useEffect(() => {
    if (refreshData) {
      console.log("Auto refreshing reports data on mount");
      handleRefresh();
    }
  }, []);

  // Function to refresh data manually
  const handleRefresh = async () => {
    if (refreshing || !refreshData) return;
    
    setRefreshing(true);
    try {
      await refreshData();
      toast.success("Report data refreshed");
    } catch (error) {
      console.error("Error refreshing report data:", error);
      toast.error("Failed to refresh report data");
    } finally {
      setRefreshing(false);
    }
  };

  // Extract unique locations and customers for filtering
  const locations = Array.from(new Set(serviceEntries.map((entry) => entry.location)));
  const customerNames = Array.from(
    new Set(serviceEntries.map((entry) => entry.customerName))
  );

  // Apply filters to service entries
  const filteredEntries = serviceEntries.filter((entry) => {
    // Filter by location
    if (filters.location !== "all" && entry.location !== filters.location) {
      return false;
    }

    // Filter by customer
    if (filters.customer !== "all" && entry.customerName !== filters.customer) {
      return false;
    }

    // Filter by date range
    if (filters.dateFrom && new Date(entry.date) < filters.dateFrom) {
      return false;
    }

    if (filters.dateTo && new Date(entry.date) > filters.dateTo) {
      return false;
    }

    return true;
  });

  // Sort entries by date (newest first)
  const sortedEntries = [...filteredEntries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Calculate summary statistics for filtered data
  const totalHours = sortedEntries.reduce((sum, entry) => sum + entry.totalHours, 0);
  const totalResidents = sortedEntries.reduce((sum, entry) => sum + entry.numberOfResidents, 0);

  // Calculate average hours per resident
  const avgHoursPerResident = totalResidents > 0 ? totalHours / totalResidents : 0;

  // Group entries by location for location report
  const entriesByLocation = locations.map((location) => {
    const locationEntries = sortedEntries.filter((entry) => entry.location === location);
    const locationHours = locationEntries.reduce((sum, entry) => sum + entry.totalHours, 0);
    const locationResidents = locationEntries.reduce((sum, entry) => sum + entry.numberOfResidents, 0);

    return {
      location,
      entries: locationEntries.length,
      hours: locationHours,
      residents: locationResidents,
    };
  });

  // Group entries by customer for customer report
  const entriesByCustomer = customerNames.map((customer) => {
    const customerEntries = sortedEntries.filter((entry) => entry.customerName === customer);
    const customerHours = customerEntries.reduce((sum, entry) => sum + entry.totalHours, 0);
    const customerResidents = customerEntries.reduce((sum, entry) => sum + entry.numberOfResidents, 0);

    return {
      customer,
      entries: customerEntries.length,
      hours: customerHours,
      residents: customerResidents,
    };
  });

  // Export report to CSV
  const exportToCSV = () => {
    let csvContent = "date,customer,location,residents,hours_worked,total_hours,notes\r\n";

    sortedEntries.forEach((entry) => {
      const formattedDate = format(new Date(entry.date), "yyyy-MM-dd");
      // Quote strings that might contain commas
      const row = [
        formattedDate,
        `"${entry.customerName}"`,
        `"${entry.location}"`,
        entry.numberOfResidents,
        entry.hoursWorked,
        entry.totalHours,
        `"${entry.notes || ""}"`
      ];
      csvContent += row.join(",") + "\r\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    // Create filename with current date
    const today = format(new Date(), "yyyy-MM-dd");
    let filename = `service_report_${today}`;
    
    // Add filter info to filename
    if (filters.location !== "all") filename += `_${filters.location}`;
    if (filters.customer !== "all") filename += `_${filters.customer}`;
    
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetFilters = () => {
    setFilters({
      location: "all",
      customer: "all",
      dateFrom: undefined,
      dateTo: undefined,
    });
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
            <Button onClick={exportToCSV} className="mt-2 sm:mt-0">
              <Download className="h-4 w-4 mr-2" />
              Export to CSV
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
          <CardDescription>Filter service entries by location, customer, and date range.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location-filter">Location</Label>
              <Select
                value={filters.location}
                onValueChange={(value) => setFilters({ ...filters, location: value })}
              >
                <SelectTrigger id="location-filter">
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer-filter">Customer</Label>
              <Select
                value={filters.customer}
                onValueChange={(value) => setFilters({ ...filters, customer: value })}
              >
                <SelectTrigger id="customer-filter">
                  <SelectValue placeholder="Filter by customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  {customerNames.map((customer) => (
                    <SelectItem key={customer} value={customer}>
                      {customer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.dateFrom && "text-muted-foreground"
                    )}
                  >
                    {filters.dateFrom ? (
                      format(filters.dateFrom, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={filters.dateFrom}
                    onSelect={(date) => setFilters({ ...filters, dateFrom: date })}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.dateTo && "text-muted-foreground"
                    )}
                  >
                    {filters.dateTo ? (
                      format(filters.dateTo, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={filters.dateTo}
                    onSelect={(date) => setFilters({ ...filters, dateTo: date })}
                    disabled={(date) => filters.dateFrom ? date < filters.dateFrom : false}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={handleResetFilters}>Reset Filters</Button>
          </div>
        </CardContent>
      </Card>

      {sortedEntries.length > 0 ? (
        <>
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

          <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Entries</TabsTrigger>
              <TabsTrigger value="by-location">By Location</TabsTrigger>
              <TabsTrigger value="by-customer">By Customer</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>Service Entries</CardTitle>
                  <CardDescription>
                    Showing {sortedEntries.length} entries
                    {filters.location !== "all" && ` for ${filters.location}`}
                    {filters.customer !== "all" && ` from ${filters.customer}`}
                    {filters.dateFrom && ` from ${format(filters.dateFrom, "MMM d, yyyy")}`}
                    {filters.dateTo && ` to ${format(filters.dateTo, "MMM d, yyyy")}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead className="text-right">Residents</TableHead>
                          <TableHead className="text-right">Hours</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedEntries.map((entry: ServiceEntry) => (
                          <TableRow key={entry.id}>
                            <TableCell>{formatDate(entry.date)}</TableCell>
                            <TableCell className="font-medium">{entry.customerName}</TableCell>
                            <TableCell>{entry.location}</TableCell>
                            <TableCell className="text-right">{entry.numberOfResidents}</TableCell>
                            <TableCell className="text-right">{entry.totalHours}</TableCell>
                            <TableCell className="text-right">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="sm">Delete</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete this service entry. This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteServiceEntry(entry.id)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="by-location">
              <Card>
                <CardHeader>
                  <CardTitle>Service Hours by Location</CardTitle>
                  <CardDescription>
                    Summary of service hours grouped by location
                    {filters.customer !== "all" && ` for ${filters.customer}`}
                    {filters.dateFrom && ` from ${format(filters.dateFrom, "MMM d, yyyy")}`}
                    {filters.dateTo && ` to ${format(filters.dateTo, "MMM d, yyyy")}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Location</TableHead>
                          <TableHead className="text-right">Entries</TableHead>
                          <TableHead className="text-right">Total Hours</TableHead>
                          <TableHead className="text-right">Total Residents</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {entriesByLocation
                          .filter((item) => item.entries > 0)
                          .sort((a, b) => b.hours - a.hours)
                          .map((item) => (
                            <TableRow key={item.location}>
                              <TableCell className="font-medium">{item.location}</TableCell>
                              <TableCell className="text-right">{item.entries}</TableCell>
                              <TableCell className="text-right">{item.hours}</TableCell>
                              <TableCell className="text-right">{item.residents}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="by-customer">
              <Card>
                <CardHeader>
                  <CardTitle>Service Hours by Customer</CardTitle>
                  <CardDescription>
                    Summary of service hours grouped by customer
                    {filters.location !== "all" && ` at ${filters.location}`}
                    {filters.dateFrom && ` from ${format(filters.dateFrom, "MMM d, yyyy")}`}
                    {filters.dateTo && ` to ${format(filters.dateTo, "MMM d, yyyy")}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer</TableHead>
                          <TableHead className="text-right">Entries</TableHead>
                          <TableHead className="text-right">Total Hours</TableHead>
                          <TableHead className="text-right">Total Residents</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {entriesByCustomer
                          .filter((item) => item.entries > 0)
                          .sort((a, b) => b.hours - a.hours)
                          .map((item) => (
                            <TableRow key={item.customer}>
                              <TableCell className="font-medium">{item.customer}</TableCell>
                              <TableCell className="text-right">{item.entries}</TableCell>
                              <TableCell className="text-right">{item.hours}</TableCell>
                              <TableCell className="text-right">{item.residents}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground mb-4">No service entries found matching your criteria.</p>
            <Button variant="outline" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Reports;
