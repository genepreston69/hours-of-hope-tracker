
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ServiceEntryForm from "@/components/ServiceEntryForm";
import ImportServiceEntries from "@/components/ImportServiceEntries";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { LOCATION_OPTIONS } from "@/constants/locations";

const ServiceEntry = () => {
  const [activeTab, setActiveTab] = useState<string>("manual-entry");

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Enter Service Hours</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual-entry">Manual Entry</TabsTrigger>
          <TabsTrigger value="import">Import from CSV</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual-entry">
          <ServiceEntryForm />
        </TabsContent>
        
        <TabsContent value="import">
          <ImportServiceEntries />
        </TabsContent>
      </Tabs>
      
      <Alert className="mt-6" variant="default">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Import Instructions</AlertTitle>
        <AlertDescription>
          When importing service entries, make sure your facility locations match exactly one of: <strong>{LOCATION_OPTIONS.join(", ")}</strong>. 
          The system will automatically map these names to the correct UUIDs in the database.
          Location names are case-insensitive but must match one of the valid options.
          If you're experiencing import errors, check your CSV file for correct location names.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ServiceEntry;
