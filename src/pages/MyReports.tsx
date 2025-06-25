
import { useEffect } from "react";
import MyReportsComponent from "@/components/MyReports";

const MyReports = () => {
  useEffect(() => {
    document.title = "My Reports | Service Community";
  }, []);

  return <MyReportsComponent />;
};

export default MyReports;
