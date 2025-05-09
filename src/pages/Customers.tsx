
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Customer } from "@/models/types";
import { generateId, parseCSV } from "@/lib/utils";
import { download, upload, users } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  contactName: z.string().optional(),
  contactEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  contactPhone: z.string().optional(),
});

const Customers = () => {
  const { customers, addCustomer, importCustomers, deleteCustomer } = useAppContext();
  const [isImporting, setIsImporting] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newCustomer: Customer = {
      id: generateId(),
      name: values.name,
      location: values.location,
      contactName: values.contactName || undefined,
      contactEmail: values.contactEmail || undefined,
      contactPhone: values.contactPhone || undefined,
    };

    addCustomer(newCustomer);
    form.reset();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0]);
      setImportError(null);
    }
  };

  const handleImport = () => {
    if (!csvFile) {
      setImportError("Please select a CSV file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        if (!event.target || typeof event.target.result !== "string") {
          throw new Error("Failed to read file");
        }

        const csvData = parseCSV(event.target.result);
        
        // Check if there are rows of data
        if (csvData.length < 2) {
          throw new Error("CSV file is empty or malformed");
        }

        // Get header row
        const headers = csvData[0].map(header => header.trim().toLowerCase());
        
        // Check for required columns
        const nameIndex = headers.indexOf("name");
        const locationIndex = headers.indexOf("location");
        
        if (nameIndex === -1 || locationIndex === -1) {
          throw new Error("CSV must contain 'name' and 'location' columns");
        }
        
        // Find optional column indices
        const contactNameIndex = headers.indexOf("contactname");
        const contactEmailIndex = headers.indexOf("contactemail");
        const contactPhoneIndex = headers.indexOf("contactphone");
        
        // Parse data rows (skipping header)
        const customersData: Customer[] = csvData.slice(1).map((row) => {
          // Skip empty rows
          if (row.length <= 1 && !row[0]) return null;
          
          const name = row[nameIndex]?.trim();
          const location = row[locationIndex]?.trim();
          
          if (!name || !location) return null;
          
          return {
            id: generateId(),
            name,
            location,
            contactName: contactNameIndex !== -1 ? row[contactNameIndex]?.trim() : undefined,
            contactEmail: contactEmailIndex !== -1 ? row[contactEmailIndex]?.trim() : undefined,
            contactPhone: contactPhoneIndex !== -1 ? row[contactPhoneIndex]?.trim() : undefined,
          };
        }).filter(Boolean) as Customer[];
        
        if (customersData.length === 0) {
          throw new Error("No valid customer data found in CSV");
        }
        
        importCustomers(customersData);
        setCsvFile(null);
        setIsImporting(false);
        
        // Reset the file input
        const fileInput = document.getElementById('csv-file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
      } catch (error) {
        console.error("CSV import error:", error);
        setImportError(error instanceof Error ? error.message : "Failed to import CSV");
      }
    };

    reader.onerror = () => {
      setImportError("Failed to read file");
    };

    reader.readAsText(csvFile);
  };

  const handleDeleteCustomer = (id: string) => {
    deleteCustomer(id);
  };

  const downloadSampleCSV = () => {
    const csvContent = "name,location,contactName,contactEmail,contactPhone\nSample Company,Main Street,John Doe,john.doe@example.com,555-123-4567";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "sample_customers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-bold">Customer Management</h1>
        <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
          <Button variant="outline" onClick={downloadSampleCSV}>
            <download className="h-4 w-4 mr-2" />
            Download CSV Template
          </Button>
          <Button onClick={() => setIsImporting(true)}>
            <upload className="h-4 w-4 mr-2" />
            Import Customers
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <users className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogDescription>
                  Enter the customer details below.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter customer name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location*</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Person</FormLabel>
                        <FormControl>
                          <Input placeholder="Contact person name (optional)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Contact email (optional)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Contact phone (optional)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter className="mt-4">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Save Customer</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Dialog open={isImporting} onOpenChange={setIsImporting}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Import Customers from CSV</DialogTitle>
            <DialogDescription>
              Upload a CSV file with customer data. The file must contain at least 'name' and 'location' columns.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="csv-file">CSV File</Label>
              <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} />
              {importError && <p className="text-sm text-destructive">{importError}</p>}
            </div>
            <div className="bg-muted p-3 rounded-md text-sm">
              <p className="font-medium">Required CSV Format:</p>
              <p className="mt-1">The first row should contain column headers:</p>
              <p className="font-mono text-xs mt-1">name,location,contactName,contactEmail,contactPhone</p>
              <p className="mt-2">Where 'name' and 'location' are required fields.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImporting(false)}>Cancel</Button>
            <Button onClick={handleImport} disabled={!csvFile}>Import Customers</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
          <CardDescription>Manage your customers and their locations.</CardDescription>
        </CardHeader>
        <CardContent>
          {customers.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.location}</TableCell>
                      <TableCell>
                        {customer.contactName && (
                          <div>
                            <p>{customer.contactName}</p>
                            {customer.contactEmail && (
                              <p className="text-sm text-muted-foreground">
                                {customer.contactEmail}
                              </p>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">Delete</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete this customer. This action cannot be undone if the customer has existing service entries.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteCustomer(customer.id)}>
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
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No customers added yet. Add your first customer to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;
