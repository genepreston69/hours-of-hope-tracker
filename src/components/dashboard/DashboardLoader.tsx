
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardLoader = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-bold">Service Community</h1>
        <div className="h-10 w-40">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      
      <div className="h-12">
        <Skeleton className="h-full w-full" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24">
            <Skeleton className="h-full w-full" />
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="h-64">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    </div>
  );
};
