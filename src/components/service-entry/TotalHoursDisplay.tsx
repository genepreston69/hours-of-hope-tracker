
interface TotalHoursDisplayProps {
  totalHours: number | null;
}

export const TotalHoursDisplay = ({ totalHours }: TotalHoursDisplayProps) => {
  if (totalHours === null) {
    return null;
  }

  return (
    <div className="p-4 bg-muted/50 rounded-md">
      <h3 className="font-medium text-sm text-muted-foreground">
        Total Service Hours
      </h3>
      <p className="text-2xl font-bold">{totalHours}</p>
    </div>
  );
};
