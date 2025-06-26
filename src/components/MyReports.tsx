
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
        <Card className="bg-white/80 backdrop-blur-xl border border-slate-200/60 nav-shadow">
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
        <h1 className="text-3xl font-bold text-slate-900">My Reports</h1>
        <p className="text-slate-600 mt-2">
          View and manage your submitted reports
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-white/60 backdrop-blur-xl border border-slate-200/60">
          <TabsTrigger value="director-reports" className="data-[state=active]:bg-white/80">Director Reports</TabsTrigger>
          <TabsTrigger value="incident-reports" className="data-[state=active]:bg-white/80">Incident Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="director-reports">
          <Card className="bg-white/80 backdrop-blur-xl border border-slate-200/60 nav-shadow">
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
          <Card className="bg-white/80 backdrop-blur-xl border border-slate-200/60 nav-shadow">
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
