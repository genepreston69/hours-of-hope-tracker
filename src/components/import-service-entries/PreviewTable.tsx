
import { CSVServiceEntry } from "@/models/types";

interface PreviewTableProps {
  preview: CSVServiceEntry[];
}

const PreviewTable = ({ preview }: PreviewTableProps) => {
  if (preview.length === 0) return null;
  
  return (
    <div>
      <h3 className="font-medium mb-2">Preview ({preview.length} entries)</h3>
      <div className="border rounded-md overflow-auto max-h-64">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-muted">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Date</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Customer</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Facility Location</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Volunteers</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Hours</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Total Hours</th>
            </tr>
          </thead>
          <tbody className="bg-popover divide-y divide-muted">
            {preview.map((entry, index) => (
              <tr key={index} className="hover:bg-muted/50">
                <td className="px-3 py-2 whitespace-nowrap text-xs">{entry.date}</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs">{entry.customer}</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs">{entry.facilityLocationId}</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs">{entry.numberOfResidents}</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs">{entry.hoursWorked}</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs">{entry.numberOfResidents * entry.hoursWorked}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PreviewTable;
