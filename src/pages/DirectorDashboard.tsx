
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, TrendingUp, FileText, Eye } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";

interface RecoverySurvey {
  id: string;
  report_date: string;
  program_name: string;
  reporter_name: string;
  staff_meetings: number;
  phase1_count: number;
  phase2_count: number;
  phase1_completions: number;
  phase2_completions: number;
  peer_mentors: number;
  mat_clients: number;
  total_intakes: number;
  mat_intakes: number;
  court_intakes: number;
  ots_count: number;
  discharges: number;
  drug_screens: number;
  created_at: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const DirectorDashboard = () => {
  const { user } = useAuth();
  const [surveys, setSurveys] = useState<RecoverySurvey[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSurvey, setSelectedSurvey] = useState<RecoverySurvey | null>(null);

  useEffect(() => {
    document.title = "Director Dashboard | Service Community";
    if (user) {
      fetchSurveys();
    }
  }, [user]);

  const fetchSurveys = async () => {
    try {
      const { data, error } = await supabase
        .from('recovery_surveys')
        .select('*')
        .order('report_date', { ascending: false });

      if (error) throw error;
      setSurveys(data || []);
    } catch (error) {
      console.error('Error fetching surveys:', error);
      toast.error('Failed to load survey data');
    } finally {
      setLoading(false);
    }
  };

  const getOverviewStats = () => {
    const totalSurveys = surveys.length;
    const totalPhase1 = surveys.reduce((sum, s) => sum + (s.phase1_count || 0), 0);
    const totalPhase2 = surveys.reduce((sum, s) => sum + (s.phase2_count || 0), 0);
    const totalIntakes = surveys.reduce((sum, s) => sum + (s.total_intakes || 0), 0);
    const totalDischarges = surveys.reduce((sum, s) => sum + (s.discharges || 0), 0);

    return { totalSurveys, totalPhase1, totalPhase2, totalIntakes, totalDischarges };
  };

  const getPhaseDistributionData = () => {
    const phase1Total = surveys.reduce((sum, s) => sum + (s.phase1_count || 0), 0);
    const phase2Total = surveys.reduce((sum, s) => sum + (s.phase2_count || 0), 0);
    
    return [
      { name: 'Phase 1', value: phase1Total, count: phase1Total },
      { name: 'Phase 2', value: phase2Total, count: phase2Total }
    ];
  };

  const getIntakeTypeData = () => {
    const matIntakes = surveys.reduce((sum, s) => sum + (s.mat_intakes || 0), 0);
    const courtIntakes = surveys.reduce((sum, s) => sum + (s.court_intakes || 0), 0);
    const otherIntakes = surveys.reduce((sum, s) => sum + ((s.total_intakes || 0) - (s.mat_intakes || 0) - (s.court_intakes || 0)), 0);
    
    return [
      { name: 'MAT Intakes', value: matIntakes, count: matIntakes },
      { name: 'Court Intakes', value: courtIntakes, count: courtIntakes },
      { name: 'Other Intakes', value: Math.max(0, otherIntakes), count: Math.max(0, otherIntakes) }
    ];
  };

  const getMonthlyTrendsData = () => {
    const monthlyData = surveys.reduce((acc, survey) => {
      const month = new Date(survey.report_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      if (!acc[month]) {
        acc[month] = { 
          month, 
          intakes: 0, 
          discharges: 0, 
          phase1: 0, 
          phase2: 0 
        };
      }
      acc[month].intakes += survey.total_intakes || 0;
      acc[month].discharges += survey.discharges || 0;
      acc[month].phase1 += survey.phase1_count || 0;
      acc[month].phase2 += survey.phase2_count || 0;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(monthlyData).slice(-6); // Last 6 months
  };

  const stats = getOverviewStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Director Dashboard</h1>
          <p className="text-muted-foreground mt-1">Recovery program analytics and insights</p>
        </div>
        <Button onClick={fetchSurveys} disabled={loading}>
          Refresh Data
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSurveys}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phase 1 Residents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPhase1}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phase 2 Residents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPhase2}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Intakes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalIntakes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Discharges</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDischarges}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Phase Distribution</CardTitle>
            <CardDescription>Current resident distribution across phases</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getPhaseDistributionData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, count }) => `${name}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getPhaseDistributionData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Intake Types</CardTitle>
            <CardDescription>Breakdown of intake sources</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getIntakeTypeData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, count }) => `${name}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getIntakeTypeData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
          <CardDescription>6-month trend analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={getMonthlyTrendsData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="intakes" stroke="#8884d8" name="Intakes" />
              <Line type="monotone" dataKey="discharges" stroke="#82ca9d" name="Discharges" />
              <Line type="monotone" dataKey="phase1" stroke="#ffc658" name="Phase 1" />
              <Line type="monotone" dataKey="phase2" stroke="#ff7300" name="Phase 2" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Director Reports</CardTitle>
          <CardDescription>All submitted director reports with option to view details</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Date</TableHead>
                <TableHead>Program Name</TableHead>
                <TableHead>Reporter</TableHead>
                <TableHead>Phase 1</TableHead>
                <TableHead>Phase 2</TableHead>
                <TableHead>Total Intakes</TableHead>
                <TableHead>Discharges</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {surveys.map((survey) => (
                <TableRow key={survey.id}>
                  <TableCell>{new Date(survey.report_date).toLocaleDateString()}</TableCell>
                  <TableCell>{survey.program_name || 'N/A'}</TableCell>
                  <TableCell>{survey.reporter_name || 'N/A'}</TableCell>
                  <TableCell>{survey.phase1_count || 0}</TableCell>
                  <TableCell>{survey.phase2_count || 0}</TableCell>
                  <TableCell>{survey.total_intakes || 0}</TableCell>
                  <TableCell>{survey.discharges || 0}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedSurvey(survey)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh]">
                        <DialogHeader>
                          <DialogTitle>Director Report Details</DialogTitle>
                          <DialogDescription>
                            Report from {new Date(survey.report_date).toLocaleDateString()}
                          </DialogDescription>
                        </DialogHeader>
                        {selectedSurvey && (
                          <ScrollArea className="h-[60vh] pr-4">
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold">Program Information</h4>
                                  <p>Program: {selectedSurvey.program_name || 'N/A'}</p>
                                  <p>Reporter: {selectedSurvey.reporter_name || 'N/A'}</p>
                                  <p>Report Date: {new Date(selectedSurvey.report_date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold">Staff Meetings</h4>
                                  <p>{selectedSurvey.staff_meetings || 0} meetings</p>
                                </div>
                              </div>
                              
                              <Separator />
                              
                              <div>
                                <h4 className="font-semibold mb-2">Resident Data</h4>
                                <div className="grid grid-cols-3 gap-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground">Phase 1 Count</p>
                                    <p className="text-lg font-semibold">{selectedSurvey.phase1_count || 0}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Phase 2 Count</p>
                                    <p className="text-lg font-semibold">{selectedSurvey.phase2_count || 0}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Peer Mentors</p>
                                    <p className="text-lg font-semibold">{selectedSurvey.peer_mentors || 0}</p>
                                  </div>
                                </div>
                              </div>
                              
                              <Separator />
                              
                              <div>
                                <h4 className="font-semibold mb-2">Intake Information</h4>
                                <div className="grid grid-cols-4 gap-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground">Total Intakes</p>
                                    <p className="text-lg font-semibold">{selectedSurvey.total_intakes || 0}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">MAT Intakes</p>
                                    <p className="text-lg font-semibold">{selectedSurvey.mat_intakes || 0}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Court Intakes</p>
                                    <p className="text-lg font-semibold">{selectedSurvey.court_intakes || 0}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">OTS Count</p>
                                    <p className="text-lg font-semibold">{selectedSurvey.ots_count || 0}</p>
                                  </div>
                                </div>
                              </div>
                              
                              <Separator />
                              
                              <div>
                                <h4 className="font-semibold mb-2">Other Metrics</h4>
                                <div className="grid grid-cols-3 gap-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground">Discharges</p>
                                    <p className="text-lg font-semibold">{selectedSurvey.discharges || 0}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Drug Screens</p>
                                    <p className="text-lg font-semibold">{selectedSurvey.drug_screens || 0}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">MAT Clients</p>
                                    <p className="text-lg font-semibold">{selectedSurvey.mat_clients || 0}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </ScrollArea>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {surveys.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No director reports found. Submit your first report to see analytics.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DirectorDashboard;
