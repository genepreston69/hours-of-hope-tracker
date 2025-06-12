
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Loader2, RefreshCw } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { NotificationSettings } from "./NotificationSettings";

interface DashboardHeaderProps {
  refreshing: boolean;
  onRefresh: () => Promise<void>;
  refreshData: (() => Promise<void>) | undefined;
  user: User | null;
  hideRefreshButton?: boolean;
}

export const DashboardHeader = ({ 
  refreshing, 
  onRefresh, 
  refreshData, 
  user,
  hideRefreshButton = false
}: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold">Service Community</h1>
        <Button 
          variant="outline" 
          size="icon"
          className="rounded-full"
          onClick={onRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh data</span>
        </Button>
      </div>
      <div className="flex gap-2 mt-2 sm:mt-0">
        {user && <NotificationSettings user={user} />}
        {refreshData && user && !hideRefreshButton && (
          <Button variant="outline" onClick={onRefresh} disabled={refreshing}>
            {refreshing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Data
              </>
            )}
          </Button>
        )}
        {user ? (
          <Button asChild>
            <Link to="/service-entry">Enter New Service Hours</Link>
          </Button>
        ) : (
          <Button asChild>
            <Link to="/auth">Sign In to Enter Hours</Link>
          </Button>
        )}
      </div>
    </div>
  );
};
