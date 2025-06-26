
import { Card, CardContent } from "@/components/ui/card";

interface StatCardsProps {
  totalHours: number;
  totalResidents: number;
  avgHoursPerResident: number;
}

export const StatCards = ({ totalHours, totalResidents, avgHoursPerResident }: StatCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="bg-white/80 backdrop-blur-xl border border-slate-200/60 nav-shadow hover:bg-white/90 transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 text-white font-bold text-lg">H</div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Service Hours</p>
              <p className="text-3xl font-bold text-slate-900">{totalHours.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white/80 backdrop-blur-xl border border-slate-200/60 nav-shadow hover:bg-white/90 transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 text-white font-bold text-lg">R</div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Residents</p>
              <p className="text-3xl font-bold text-slate-900">{totalResidents.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white/80 backdrop-blur-xl border border-slate-200/60 nav-shadow hover:bg-white/90 transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#0077be] to-[#005a8f] rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 text-white font-bold text-lg">A</div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Avg. Hours per Resident</p>
              <p className="text-3xl font-bold text-slate-900">{avgHoursPerResident.toFixed(1)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
