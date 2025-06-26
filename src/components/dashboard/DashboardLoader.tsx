
import { Skeleton } from "@/components/ui/skeleton";
import { Activity } from "lucide-react";

export const DashboardLoader = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-zinc-50 to-stone-50">
      <div className="container mx-auto p-6">
        <div className="space-y-6 animate-fade-in">
          {/* Header Card Skeleton */}
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-6 nav-shadow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Service Dashboard</h1>
                  <p className="text-slate-500">Loading dashboard data...</p>
                </div>
              </div>
              <Skeleton className="h-10 w-40 mt-4 sm:mt-0" />
            </div>
          </div>
          
          {/* Date Filter Skeleton */}
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-6 nav-shadow">
            <Skeleton className="h-12 w-full" />
          </div>
          
          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-6 nav-shadow">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Main Content Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl nav-shadow">
              <div className="p-6 border-b border-slate-100">
                <Skeleton className="h-6 w-64 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-xl" />
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl nav-shadow">
              <div className="p-6 border-b border-slate-100">
                <Skeleton className="h-6 w-64 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-3 w-full rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
