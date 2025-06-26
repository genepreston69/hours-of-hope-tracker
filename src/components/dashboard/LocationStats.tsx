
import { LocationStats } from "@/models/types";

interface LocationStatsProps {
  locationStats: LocationStats[];
}

export const LocationStatsCard = ({ locationStats }: LocationStatsProps) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl overflow-hidden nav-shadow">
      <div className="p-6 border-b border-slate-100">
        <h3 className="text-lg font-semibold text-slate-900 tracking-tight">Service Hours by Location</h3>
        <p className="text-sm text-slate-500 mt-1">Total hours for each recovery house location</p>
      </div>
      <div className="p-6">
        {locationStats.length > 0 ? (
          <div className="space-y-6">
            {locationStats.map((stat) => (
              <div key={stat.location} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-900">{stat.location}</span>
                  <span className="text-sm text-slate-500 bg-white/60 px-2 py-1 rounded-lg">{stat.entries} entries</span>
                </div>
                <div className="space-y-2">
                  <div className="w-full bg-gradient-to-r from-slate-200/60 to-zinc-200/60 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#0077be] to-[#005a8f] h-full rounded-full transition-all duration-300 ease-out" 
                      style={{ 
                        width: `${Math.min(100, (stat.hours / Math.max(...locationStats.map(s => s.hours))) * 100)}%` 
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Total Hours</span>
                    <span className="font-semibold text-slate-900 bg-white/60 px-2 py-1 rounded-lg">{stat.hours} hrs</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-center py-8">No location data available.</p>
        )}
      </div>
    </div>
  );
};
