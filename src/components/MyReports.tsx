
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MyReportsTable } from "./my-reports/MyReportsTable";
import { useAuth } from "@/hooks/use-auth";

const MyReports = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("director-reports");

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You must be logged in to view your reports.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Reports</h1>
        <p className="text-gray-600 mt-2">
          View and manage your submitted reports
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="director-reports">Director Reports</TabsTrigger>
          <TabsTrigger value="incident-reports">Incident Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="director-reports">
          <Card>
            <CardHeader>
              <CardTitle>Director Reports</CardTitle>
              <CardDescription>
                Your submitted director reports and recovery surveys
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MyReportsTable reportType="director" userId={user.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incident-reports">
          <Card>
            <CardHeader>
              <CardTitle>Incident Reports</CardTitle>
              <CardDescription>
                Your submitted incident reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MyReportsTable reportType="incident" userId={user.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyReports;
