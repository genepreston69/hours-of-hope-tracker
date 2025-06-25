
interface EmptyReportsStateProps {
  reportType: "director" | "incident";
}

export const EmptyReportsState = ({ reportType }: EmptyReportsStateProps) => {
  return (
    <div className="text-center py-8 text-gray-500">
      <p>No {reportType} reports found.</p>
      <p className="text-sm mt-2">
        {reportType === "director" 
          ? "Create your first director report to get started."
          : "Create your first incident report to get started."
        }
      </p>
    </div>
  );
};
