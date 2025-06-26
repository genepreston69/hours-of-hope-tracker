
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { Activity, Plus } from "lucide-react";

interface EmptyDashboardProps {
  user: User | null;
}

export const EmptyDashboard = ({ user }: EmptyDashboardProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-zinc-50 to-stone-50">
      <div className="container mx-auto p-6">
        <div className="space-y-6 animate-fade-in">
          {/* Header Card */}
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-6 nav-shadow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Service Dashboard</h1>
                  <p className="text-slate-500">Welcome to Service Community</p>
                </div>
              </div>
              {user ? (
                <Button asChild className="mt-4 sm:mt-0 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white border-0">
                  <Link to="/service-entry">
                    <Plus className="mr-2 h-4 w-4" />
                    Enter New Service Hours
                  </Link>
                </Button>
              ) : (
                <Button asChild className="mt-4 sm:mt-0 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white border-0">
                  <Link to="/auth">Sign In to Enter Hours</Link>
                </Button>
              )}
            </div>
          </div>
          
          {/* Welcome Card */}
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-12 nav-shadow text-center">
            <div className="max-w-md mx-auto space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                <Activity className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to Service Community</h2>
                <p className="text-slate-600">
                  {user 
                    ? "Add your first service entry to see your dashboard stats" 
                    : "Sign in to access all features and record volunteer service hours"}
                </p>
              </div>
              {user ? (
                <Button asChild size="lg" className="bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white border-0">
                  <Link to="/service-entry">
                    <Plus className="mr-2 h-5 w-5" />
                    Add Service Entry
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white border-0">
                  <Link to="/auth">Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
