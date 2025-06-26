
import { ServiceStats } from "@/models/types";

interface StatCardsProps {
  stats: ServiceStats;
}

export const StatCards = ({ stats }: StatCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-6 nav-shadow hover:bg-white/90 transition-all duration-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
            <div className="w-6 h-6 text-white font-bold text-lg">H</div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Service Hours</p>
            <p className="text-3xl font-bold text-slate-900">{stats.totalHours.toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-6 nav-shadow hover:bg-white/90 transition-all duration-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
            <div className="w-6 h-6 text-white font-bold text-lg">E</div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Engagements</p>
            <p className="text-3xl font-bold text-slate-900">{stats.totalEntries.toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-6 nav-shadow hover:bg-white/90 transition-all duration-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#0077be] to-[#005a8f] rounded-xl flex items-center justify-center">
            <div className="w-6 h-6 text-white font-bold text-lg">A</div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Avg. Hours per Volunteer</p>
            <p className="text-3xl font-bold text-slate-900">{stats.averageHoursPerResident.toFixed(0)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
