
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
    <div className="max-w-2xl mx-auto" style={{ "--success": "hsl(143, 85%, 48%)", "--warning": "hsl(48, 96%, 53%)" }}>
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
          When importing service entries, make sure your facility locations match one of: {LOCATION_OPTIONS.join(", ")}. 
          The system will automatically map these names to the correct UUIDs in the database.
          Each entry will be assigned a proper UUID to ensure database compatibility.
          If you're experiencing import errors, check your CSV file for correct formatting and valid location names.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ServiceEntry;
