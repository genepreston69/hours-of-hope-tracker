
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const ReportsTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Report</TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Created</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
