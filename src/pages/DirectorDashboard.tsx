
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
  week_summary: string;
  events: string;
  upcoming_events: string;
  accomplishments: string;
  staff_meetings: number;
  meeting_dates: string;
  evaluations: string;
  evaluation_details: string;
  staffing_needs: string;
  phase1_count: number;
  phase2_count: number;
  phase1_completions: number;
  phase1_next_steps: string;
  phase2_completions: number;
  phase2_next_steps: string;
  peer_mentors: number;
  mat_clients: number;
  total_intakes: number;
  mat_intakes: number;
  court_intakes: number;
  scheduled_intakes: number;
  ots1_orientations: number;
  ots_count: number;
  discharges: number;
  discharge_reasons: string;
  drug_screens: number;
  facility_issues: string;
  supply_needs: string;
  program_concerns: string;
  celebrations: string;
  additional_comments: string;
  created_at: string;
  user_id: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const DirectorDashboard = () => {
  const { user } = useAuth();
  const [surveys, setSurveys] = useState<RecoverySurvey[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSurvey, setSelectedSurvey] = useState<RecoverySurvey | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Director Dashboard | Service Community";
    if (user) {
      console.log("DirectorDashboard: User authenticated, fetching surveys...", user.email);
      fetchSurveys();
    } else {
      console.log("DirectorDashboard: No authenticated user");
      setLoading(false);
    }
  }, [user]);

  const fetchSurveys = async () => {
    try {
      console.log("DirectorDashboard: Starting survey fetch...");
      setError(null);
      
      // Fetch all surveys (RLS policies now allow all authenticated users to view all surveys)
      const { data: allSurveys, error: fetchError } = await supabase
        .from('recovery_surveys')
        .select('*')
        .order('report_date', { ascending: false });

      console.log("DirectorDashboard: Survey fetch result:", { allSurveys, fetchError });

      if (fetchError) {
        console.error('DirectorDashboard: Error fetching surveys:', fetchError);
        setError(`Failed to fetch surveys: ${fetchError.message}`);
        throw fetchError;
      }
      
      console.log(`DirectorDashboard: Successfully fetched ${allSurveys?.length || 0} surveys`);
      setSurveys(allSurveys || []);
    } catch (error: any) {
      console.error('DirectorDashboard: Unexpected error:', error);
      setError(`Unexpected error: ${error.message || 'Unknown error'}`);
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
    const currentOTS = surveys.length > 0 ? surveys[0].ots_count || 0 : 0; // Get OTS count from most recent survey

    return { totalSurveys, totalPhase1, totalPhase2, totalIntakes, totalDischarges, currentOTS };
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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <FileText className="h-12 w-12 mx-auto mb-2" />
            <h3 className="text-lg font-semibold">Error Loading Data</h3>
          </div>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchSurveys}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Authentication Required</h3>
          <p className="text-muted-foreground">Please sign in to view the Director Dashboard.</p>
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

      {surveys.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No Director Reports Found</h3>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            Start by submitting director reports through the "Director Report" page to see comprehensive analytics and insights here.
          </p>
          <Button onClick={() => window.location.href = '/recovery-survey'}>
            Submit Report
          </Button>
        </div>
      ) : (
        <>
          {/* Overview Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">OTS Residents</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.currentOTS}</div>
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
              <CardDescription>All submitted director reports with complete field details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Date</TableHead>
                      <TableHead>Program Name</TableHead>
                      <TableHead>Reporter</TableHead>
                      <TableHead>Week Summary</TableHead>
                      <TableHead>Events</TableHead>
                      <TableHead>Upcoming Events</TableHead>
                      <TableHead>Accomplishments</TableHead>
                      <TableHead>Staff Meetings</TableHead>
                      <TableHead>Meeting Dates</TableHead>
                      <TableHead>Evaluations</TableHead>
                      <TableHead>Evaluation Details</TableHead>
                      <TableHead>Staffing Needs</TableHead>
                      <TableHead>Phase 1 Count</TableHead>
                      <TableHead>Phase 2 Count</TableHead>
                      <TableHead>Phase 1 Completions</TableHead>
                      <TableHead>Phase 1 Next Steps</TableHead>
                      <TableHead>Phase 2 Completions</TableHead>
                      <TableHead>Phase 2 Next Steps</TableHead>
                      <TableHead>Peer Mentors</TableHead>
                      <TableHead>MAT Clients</TableHead>
                      <TableHead>Total Intakes</TableHead>
                      <TableHead>MAT Intakes</TableHead>
                      <TableHead>Court Intakes</TableHead>
                      <TableHead>Scheduled Intakes</TableHead>
                      <TableHead>OTS1 Orientations</TableHead>
                      <TableHead>OTS Count</TableHead>
                      <TableHead>Discharges</TableHead>
                      <TableHead>Discharge Reasons</TableHead>
                      <TableHead>Drug Screens</TableHead>
                      <TableHead>Facility Issues</TableHead>
                      <TableHead>Supply Needs</TableHead>
                      <TableHead>Program Concerns</TableHead>
                      <TableHead>Celebrations</TableHead>
                      <TableHead>Additional Comments</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {surveys.map((survey) => (
                      <TableRow key={survey.id}>
                        <TableCell>{survey.report_date ? new Date(survey.report_date).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell>{survey.program_name || 'N/A'}</TableCell>
                        <TableCell>{survey.reporter_name || 'N/A'}</TableCell>
                        <TableCell className="max-w-xs truncate">{survey.week_summary || 'N/A'}</TableCell>
                        <TableCell className="max-w-xs truncate">{survey.events || 'N/A'}</TableCell>
                        <TableCell className="max-w-xs truncate">{survey.upcoming_events || 'N/A'}</TableCell>
                        <TableCell className="max-w-xs truncate">{survey.accomplishments || 'N/A'}</TableCell>
                        <TableCell>{survey.staff_meetings || 0}</TableCell>
                        <TableCell className="max-w-xs truncate">{survey.meeting_dates || 'N/A'}</TableCell>
                        <TableCell className="max-w-xs truncate">{survey.evaluations || 'N/A'}</TableCell>
                        <TableCell className="max-w-xs truncate">{survey.evaluation_details || 'N/A'}</TableCell>
                        <TableCell className="max-w-xs truncate">{survey.staffing_needs || 'N/A'}</TableCell>
                        <TableCell>{survey.phase1_count || 0}</TableCell>
                        <TableCell>{survey.phase2_count || 0}</TableCell>
                        <TableCell>{survey.phase1_completions || 0}</TableCell>
                        <TableCell className="max-w-xs truncate">{survey.phase1_next_steps || 'N/A'}</TableCell>
                        <TableCell>{survey.phase2_completions || 0}</TableCell>
                        <TableCell className="max-w-xs truncate">{survey.phase2_next_steps || 'N/A'}</TableCell>
                        <TableCell>{survey.peer_mentors || 0}</TableCell>
                        <TableCell>{survey.mat_clients || 0}</TableCell>
                        <TableCell>{survey.total_intakes || 0}</TableCell>
                        <TableCell>{survey.mat_intakes || 0}</TableCell>
                        <TableCell>{survey.court_intakes || 0}</TableCell>
                        <TableCell>{survey.scheduled_intakes || 0}</TableCell>
                        <TableCell>{survey.ots1_orientations || 0}</TableCell>
                        <TableCell>{survey.ots_count || 0}</TableCell>
                        <TableCell>{survey.discharges || 0}</TableCell>
                        <TableCell className="max-w-xs truncate">{survey.discharge_reasons || 'N/A'}</TableCell>
                        <TableCell>{survey.drug_screens || 0}</TableCell>
                        <TableCell className="max-w-xs truncate">{survey.facility_issues || 'N/A'}</TableCell>
                        <TableCell className="max-w-xs truncate">{survey.supply_needs || 'N/A'}</TableCell>
                        <TableCell className="max-w-xs truncate">{survey.program_concerns || 'N/A'}</TableCell>
                        <TableCell className="max-w-xs truncate">{survey.celebrations || 'N/A'}</TableCell>
                        <TableCell className="max-w-xs truncate">{survey.additional_comments || 'N/A'}</TableCell>
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
                                  Report from {survey.report_date ? new Date(survey.report_date).toLocaleDateString() : 'N/A'}
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
                                        <p>Report Date: {selectedSurvey.report_date ? new Date(selectedSurvey.report_date).toLocaleDateString() : 'N/A'}</p>
                                      </div>
                                      <div>
                                        <h4 className="font-semibold">Staff Meetings</h4>
                                        <p>{selectedSurvey.staff_meetings || 0} meetings</p>
                                        <p>Meeting Dates: {selectedSurvey.meeting_dates || 'N/A'}</p>
                                      </div>
                                    </div>
                                    
                                    <Separator />
                                    
                                    <div>
                                      <h4 className="font-semibold mb-2">Weekly Summary & Events</h4>
                                      <div className="space-y-2">
                                        <div>
                                          <p className="text-sm text-muted-foreground">Week Summary</p>
                                          <p className="text-sm">{selectedSurvey.week_summary || 'N/A'}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-muted-foreground">Events</p>
                                          <p className="text-sm">{selectedSurvey.events || 'N/A'}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-muted-foreground">Upcoming Events</p>
                                          <p className="text-sm">{selectedSurvey.upcoming_events || 'N/A'}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-muted-foreground">Accomplishments</p>
                                          <p className="text-sm">{selectedSurvey.accomplishments || 'N/A'}</p>
                                        </div>
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
                                        <div>
                                          <p className="text-sm text-muted-foreground">Phase 1 Completions</p>
                                          <p className="text-lg font-semibold">{selectedSurvey.phase1_completions || 0}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-muted-foreground">Phase 2 Completions</p>
                                          <p className="text-lg font-semibold">{selectedSurvey.phase2_completions || 0}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-muted-foreground">OTS Count</p>
                                          <p className="text-lg font-semibold">{selectedSurvey.ots_count || 0}</p>
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
                                          <p className="text-sm text-muted-foreground">Scheduled Intakes</p>
                                          <p className="text-lg font-semibold">{selectedSurvey.scheduled_intakes || 0}</p>
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
                                        <div>
                                          <p className="text-sm text-muted-foreground">OTS1 Orientations</p>
                                          <p className="text-lg font-semibold">{selectedSurvey.ots1_orientations || 0}</p>
                                        </div>
                                      </div>
                                    </div>

                                    <Separator />
                                    
                                    <div>
                                      <h4 className="font-semibold mb-2">Additional Information</h4>
                                      <div className="space-y-3">
                                        <div>
                                          <p className="text-sm text-muted-foreground">Evaluations</p>
                                          <p className="text-sm">{selectedSurvey.evaluations || 'N/A'}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-muted-foreground">Evaluation Details</p>
                                          <p className="text-sm">{selectedSurvey.evaluation_details || 'N/A'}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-muted-foreground">Staffing Needs</p>
                                          <p className="text-sm">{selectedSurvey.staffing_needs || 'N/A'}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-muted-foreground">Phase 1 Next Steps</p>
                                          <p className="text-sm">{selectedSurvey.phase1_next_steps || 'N/A'}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-muted-foreground">Phase 2 Next Steps</p>
                                          <p className="text-sm">{selectedSurvey.phase2_next_steps || 'N/A'}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-muted-foreground">Discharge Reasons</p>
                                          <p className="text-sm">{selectedSurvey.discharge_reasons || 'N/A'}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-muted-foreground">Facility Issues</p>
                                          <p className="text-sm">{selectedSurvey.facility_issues || 'N/A'}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-muted-foreground">Supply Needs</p>
                                          <p className="text-sm">{selectedSurvey.supply_needs || 'N/A'}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-muted-foreground">Program Concerns</p>
                                          <p className="text-sm">{selectedSurvey.program_concerns || 'N/A'}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-muted-foreground">Celebrations</p>
                                          <p className="text-sm">{selectedSurvey.celebrations || 'N/A'}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-muted-foreground">Additional Comments</p>
                                          <p className="text-sm">{selectedSurvey.additional_comments || 'N/A'}</p>
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
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default DirectorDashboard;
