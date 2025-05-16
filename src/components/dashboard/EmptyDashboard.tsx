
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { User } from "@supabase/supabase-js";

interface EmptyDashboardProps {
  user: User | null;
}

export const EmptyDashboard = ({ user }: EmptyDashboardProps) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-bold">Service Community</h1>
        {user ? (
          <Button asChild className="mt-2 sm:mt-0">
            <Link to="/service-entry">Enter New Service Hours</Link>
          </Button>
        ) : (
          <Button asChild className="mt-2 sm:mt-0">
            <Link to="/auth">Sign In to Enter Hours</Link>
          </Button>
        )}
      </div>
      
      <div className="flex items-center justify-center h-[40vh] flex-col space-y-4 border rounded-lg p-10 bg-muted/20">
        <p className="text-xl">Welcome to Service Community</p>
        <p className="text-muted-foreground text-center">
          {user 
            ? "Add your first service entry to see your dashboard stats" 
            : "Sign in to access all features and record volunteer service hours"}
        </p>
        {user ? (
          <Button asChild>
            <Link to="/service-entry">Add Service Entry</Link>
          </Button>
        ) : (
          <Button asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
        )}
      </div>
    </div>
  );
};
