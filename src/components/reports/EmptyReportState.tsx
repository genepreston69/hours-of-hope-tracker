
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EmptyReportStateProps {
  onResetFilters: () => void;
}

export const EmptyReportState = ({ onResetFilters }: EmptyReportStateProps) => {
  return (
    <Card>
      <CardContent className="py-10 text-center">
        <p className="text-muted-foreground mb-4">No service entries found matching your criteria.</p>
        <Button variant="outline" onClick={onResetFilters}>
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
};
