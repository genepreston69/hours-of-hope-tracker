
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface MonthlyTrendsProps {
  trendsData: Array<{
    month: string;
    intakes: number;
    discharges: number;
    phase1: number;
    phase2: number;
  }>;
}

export const MonthlyTrends = ({ trendsData }: MonthlyTrendsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Trends</CardTitle>
        <CardDescription>6-month trend analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={trendsData}>
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
  );
};
