
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ServiceEntry } from "@/models/types";
import { formatDate } from "@/lib/utils";
import { format } from "date-fns";
import { ReportFilters } from "./ReportFilters";
import { Tables } from "@/integrations/supabase/types";
import { IncidentReportsTable } from "./IncidentReportsTable";

type IncidentReport = Tables<'incident_reports'>;

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
  incidentReports?: IncidentReport[];
  deleteIncidentReport?: (id: string) => void;
}

export const ReportTabs = ({
  currentTab,
  setCurrentTab,
  sortedEntries,
  entriesByLocation,
  entriesByCustomer,
  deleteServiceEntry,
  filters,
  incidentReports = [],
  deleteIncidentReport
}: ReportTabsProps) => {
  return (
    <Tabs defaultValue="service-entries" value={currentTab} onValueChange={setCurrentTab}>
      <TabsList className="grid w-full grid-cols-2 bg-white/60 backdrop-blur-xl border border-slate-200/60">
        <TabsTrigger value="service-entries" className="data-[state=active]:bg-white/80">Service Entries</TabsTrigger>
        <TabsTrigger value="incident-reports" className="data-[state=active]:bg-white/80">Incident Reports</TabsTrigger>
      </TabsList>
      
      <TabsContent value="service-entries">
        <Card className="bg-white/80 backdrop-blur-xl border border-slate-200/60 nav-shadow">
          <CardHeader>
            <CardTitle className="text-slate-900">Service Entries</CardTitle>
            <CardDescription className="text-slate-600">
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

      <TabsContent value="incident-reports">
        <IncidentReportsTable 
          incidentReports={incidentReports}
          deleteIncidentReport={deleteIncidentReport}
        />
      </TabsContent>
    </Tabs>
  );
};
