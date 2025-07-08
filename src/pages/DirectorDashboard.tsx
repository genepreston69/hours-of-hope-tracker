import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, TrendingUp, FileText, Eye } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { toast } from "@/components/ui/sonner";
import { ReportsTable } from "@/components/director-dashboard/ReportsTable";
import { Tables } from "@/integrations/supabase/types";

type RecoverySurvey = Tables<'recovery_surveys'>;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const DirectorDashboard = () => {
  const { user } = useAuth();
  const [surveys, setSurveys] = useState<RecoverySurvey[]>([]);
  const [loading, setLoading] = useState(true);
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
    
    // Log surveys for debugging
    console.log("DirectorDashboard: Processing surveys for stats:", surveys.length, surveys.map(s => ({
      program_name: s.program_name,
      report_date: s.report_date,
      phase1_count: s.phase1_count,
      phase2_count: s.phase2_count,
      ots_count: s.ots_count,
      total_intakes: s.total_intakes
    })));
    
    // Point-in-time values from CURRENT REPORTING WEEK only
    const getCurrentWeekReports = () => {
      if (surveys.length === 0) return [];
      
      // Get the most recent report date to determine current reporting week
      const mostRecentDate = surveys[0].report_date;
      console.log("DirectorDashboard: Current reporting week date:", mostRecentDate);
      
      // Only include reports from the current reporting week
      const currentWeekReports = surveys.filter(survey => survey.report_date === mostRecentDate);
      
      console.log("DirectorDashboard: Current week reports:", currentWeekReports.map(s => ({
        program_name: s.program_name,
        report_date: s.report_date,
        phase1_count: s.phase1_count,
        phase2_count: s.phase2_count,
        ots_count: s.ots_count
      })));
      
      return currentWeekReports;
    };
    
    const currentWeekReports = getCurrentWeekReports();
    const currentPhase1 = currentWeekReports.reduce((sum, s) => sum + (s.phase1_count || 0), 0);
    const currentPhase2 = currentWeekReports.reduce((sum, s) => sum + (s.phase2_count || 0), 0);
    const currentOTS = currentWeekReports.reduce((sum, s) => sum + (s.ots_count || 0), 0);
    
    console.log("DirectorDashboard: Current week totals:", {
      currentPhase1,
      currentPhase2,
      currentOTS,
      locationsReported: currentWeekReports.map(s => s.program_name)
    });
    
    // Cumulative values that should be summed
    const totalIntakes = surveys.reduce((sum, s) => sum + (s.total_intakes || 0), 0);
    const totalDischarges = surveys.reduce((sum, s) => sum + (s.discharges || 0), 0);
    const totalGEDStarts = surveys.reduce((sum, s) => sum + (s.ged_preparation_starts || 0), 0);
    const totalGEDCompletions = surveys.reduce((sum, s) => sum + (s.ged_completions || 0), 0);
    const totalLifeSkillsStarts = surveys.reduce((sum, s) => sum + (s.life_skills_starts || 0), 0);
    const totalDriversLicenses = surveys.reduce((sum, s) => sum + (s.drivers_license_received || 0), 0);

    console.log("DirectorDashboard: Calculated totals:", {
      totalIntakes,
      totalDischarges,
      totalGEDStarts,
      totalGEDCompletions,
      totalLifeSkillsStarts,
      totalDriversLicenses
    });

    const totalCurrentResidents = currentOTS + currentPhase1 + currentPhase2;

    return { 
      totalSurveys, 
      currentPhase1, 
      currentPhase2, 
      totalIntakes, 
      totalDischarges, 
      currentOTS,
      totalCurrentResidents,
      totalGEDStarts,
      totalGEDCompletions,
      totalLifeSkillsStarts,
      totalDriversLicenses
    };
  };

  const getPhaseDistributionData = () => {
    // Use point-in-time values from CURRENT REPORTING WEEK only
    const getCurrentWeekReports = () => {
      if (surveys.length === 0) return [];
      
      // Get the most recent report date to determine current reporting week
      const mostRecentDate = surveys[0].report_date;
      
      // Only include reports from the current reporting week
      return surveys.filter(survey => survey.report_date === mostRecentDate);
    };
    
    const currentWeekReports = getCurrentWeekReports();
    const currentPhase1 = currentWeekReports.reduce((sum, s) => sum + (s.phase1_count || 0), 0);
    const currentPhase2 = currentWeekReports.reduce((sum, s) => sum + (s.phase2_count || 0), 0);
    
    return [
      { name: 'Phase 1', value: currentPhase1, count: currentPhase1 },
      { name: 'Phase 2', value: currentPhase2, count: currentPhase2 }
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
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
                <div className="text-2xl font-bold">{stats.currentPhase1}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Phase 2 Residents</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.currentPhase2}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Residents</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCurrentResidents}</div>
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

          {/* Education & Life Skills Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">GED Starts</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalGEDStarts}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">GED Completions</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalGEDCompletions}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Life Skills Starts</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalLifeSkillsStarts}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Drivers Licenses</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalDriversLicenses}</div>
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

          {/* Reports Table - Now using the ReportsTable component which includes the ReportDetailsDialog */}
          <ReportsTable surveys={surveys} />
        </>
      )}
    </div>
  );
};

export default DirectorDashboard;
