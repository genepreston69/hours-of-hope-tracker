
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ServiceEntryForm from "@/components/ServiceEntryForm";
import ImportServiceEntries from "@/components/ImportServiceEntries";

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
    </div>
  );
};

export default ServiceEntry;
