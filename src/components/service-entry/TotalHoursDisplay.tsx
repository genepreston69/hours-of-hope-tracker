
interface TotalHoursDisplayProps {
  totalHours: number | null;
  hoursWorked?: number | null;
}

export const TotalHoursDisplay = ({ totalHours, hoursWorked }: TotalHoursDisplayProps) => {
  if (totalHours === null && hoursWorked === null) {
    return null;
  }

  return (
    <div className="p-4 bg-muted/50 rounded-md space-y-2">
      {hoursWorked !== null && (
        <div>
          <h3 className="font-medium text-sm text-muted-foreground">
            Hours Worked (Calculated)
          </h3>
          <p className="text-lg font-semibold">{hoursWorked}</p>
        </div>
      )}
      
      {totalHours !== null && (
        <div>
          <h3 className="font-medium text-sm text-muted-foreground">
            Total Service Hours
          </h3>
          <p className="text-2xl font-bold">{totalHours}</p>
        </div>
      )}
    </div>
  );
};
