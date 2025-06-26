
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ServiceEntry } from "@/models/types";
import { formatDate } from "@/lib/utils";
import { format } from "date-fns";
import { ReportFilters } from "./ReportFilters";

interface ReportTabsProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  sortedEntries: ServiceEntry[];
  entriesByLocation: {
    location: string;
    entries: number;
    hours: number;
    residents: number;
  }[];
  entriesByCustomer: {
    customer: string;
    entries: number;
    hours: number;
    residents: number;
  }[];
  deleteServiceEntry: (id: string) => void;
  filters: ReportFilters;
}

export const ReportTabs = ({
  currentTab,
  setCurrentTab,
  sortedEntries,
  entriesByLocation,
  entriesByCustomer,
  deleteServiceEntry,
  filters
}: ReportTabsProps) => {
  return (
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
  );
};
