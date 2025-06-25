
import { Badge } from "@/components/ui/badge";

interface ReportStatusBadgeProps {
  status: string;
}

export const ReportStatusBadge = ({ status }: ReportStatusBadgeProps) => {
  const getVariant = (status: string) => {
    switch (status) {
      case 'draft':
        return 'secondary';
      case 'submitted':
        return 'default';
      case 'reviewed':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const getLabel = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Draft';
      case 'submitted':
        return 'Submitted';
      case 'reviewed':
        return 'Reviewed';
      default:
        return 'Unknown';
    }
  };

  return (
    <Badge variant={getVariant(status)}>
      {getLabel(status)}
    </Badge>
  );
};
