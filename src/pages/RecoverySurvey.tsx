
import { useEffect } from "react";
import RecoveryPointSurvey from "@/components/RecoveryPointSurvey";

const RecoverySurvey = () => {
  useEffect(() => {
    document.title = "Recovery Survey | Service Community";
  }, []);

  return <RecoveryPointSurvey />;
};

export default RecoverySurvey;
