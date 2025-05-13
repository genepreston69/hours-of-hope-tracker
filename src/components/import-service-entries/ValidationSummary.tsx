
import { Card } from "@/components/ui/card";
import { CheckCircle, AlertCircle } from "lucide-react";

interface ValidationSummaryProps {
  totalRows: number;
  validRows: number;
  invalidRows: number;
}

const ValidationSummary = ({ totalRows, validRows, invalidRows }: ValidationSummaryProps) => {
  const allValid = validRows === totalRows && totalRows > 0;
  
  return (
    <Card className={`p-4 border-l-4 bg-muted/30 space-y-2 ${allValid ? 'border-green-500' : 'border-yellow-500'}`}>
      <div className="flex items-center gap-2">
        {allValid ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <AlertCircle className="h-5 w-5 text-yellow-500" />
        )}
        <h3 className="font-medium">Validation Summary</h3>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-2 text-center">
        <div>
          <p className="text-muted-foreground text-sm">Total Rows</p>
          <p className="font-medium text-lg">{totalRows}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Valid</p>
          <p className="font-medium text-lg text-green-500">{validRows}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Invalid</p>
          <p className="font-medium text-lg text-destructive">{invalidRows}</p>
        </div>
      </div>
      
      {allValid ? (
        <p className="text-sm text-green-500">All rows are valid and ready for import.</p>
      ) : invalidRows > 0 ? (
        <p className="text-sm text-yellow-500">Please fix the errors before importing.</p>
      ) : (
        <p className="text-sm">Validation complete. Review the data before importing.</p>
      )}
    </Card>
  );
};

export default ValidationSummary;
