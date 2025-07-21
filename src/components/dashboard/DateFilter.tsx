
import { CalendarClock } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// Define filter types
export type DateFilterType = "mtd" | "ytd";

interface DateFilterProps {
  dateFilter: DateFilterType;
  setDateFilter: (value: DateFilterType) => void;
}

export const DateFilter = ({ dateFilter, setDateFilter }: DateFilterProps) => {
  return (
    <div className="flex items-center justify-end">
      <div className="flex items-center gap-2">
        <CalendarClock className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm font-medium">Filter:</span>
        <ToggleGroup 
          type="single" 
          value={dateFilter} 
          onValueChange={(value) => value && setDateFilter(value as DateFilterType)}
        >
          <ToggleGroupItem value="mtd" size="sm">Month to Date</ToggleGroupItem>
          <ToggleGroupItem value="ytd" size="sm">Year to Date</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};
