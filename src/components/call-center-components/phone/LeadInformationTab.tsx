"use client";
import { useEffect, useState } from "react";
import LeadInformation from "./LeadInformation";
import FinishLead from "./FinishLead";
import { useIsCallHangUp } from "@/redux/slice/commonSlice";

/* ============================== LEAD INFORMATION TAB ============================== */

const LeadInformationTab = () => {
  const [isHangUp, setIsHangUp] = useState<boolean>(false);
  const isCallHangUp = useIsCallHangUp();

  useEffect(() => {
    if (!isCallHangUp) {
      setIsHangUp(false);
    }
  }, [isCallHangUp]);

  return (
    <>
      {isHangUp ? (
        <>
          <FinishLead setIsHangUp={setIsHangUp} />
        </>
      ) : (
        <LeadInformation setIsHangUp={setIsHangUp} />
      )}
    </>
  );
};

export default LeadInformationTab;
