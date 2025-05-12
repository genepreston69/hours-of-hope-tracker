
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { DateFilter, DateFilterType } from "@/components/dashboard/DateFilter";
import { StatCards } from "@/components/dashboard/StatCards";
import { RecentEntries } from "@/components/dashboard/RecentEntries";
import { LocationStatsCard } from "@/components/dashboard/LocationStats";
import { useDashboardData } from "@/hooks/use-dashboard-data";

const Dashboard = () => {
  const { serviceEntries } = useAppContext();
  const [dateFilter, setDateFilter] = useState<DateFilterType>("ytd");
  
  const { filteredStats, filteredLocationStats, recentEntries } = useDashboardData(
    serviceEntries,
    dateFilter
  );

  // Set document title
  useEffect(() => {
    document.title = "Dashboard | Recovery Resident Service Tracker";
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild className="mt-2 sm:mt-0">
          <Link to="/service-entry">Enter New Service Hours</Link>
        </Button>
      </div>
      
      <DateFilter dateFilter={dateFilter} setDateFilter={setDateFilter} />
      <StatCards stats={filteredStats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentEntries entries={recentEntries} />
        <LocationStatsCard locationStats={filteredLocationStats} />
      </div>
    </div>
  );
};

export default Dashboard;
