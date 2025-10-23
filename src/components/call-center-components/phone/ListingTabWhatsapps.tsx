"use client";
import { useEffect, useState } from "react";

// PROJECT IMPORTS
import Conversation from "./Conversation/Conversation";
import { FollowUpModal } from "@/components/modals";
import NoteAdd from "./NoteAdd";
import { useAuth } from "@/contexts/hooks/useAuth";
import { isWhatsAppEnabled } from "@/components/helperFunctions";
import { useCampaignType } from "@/redux/slice/commonSlice";

/* ============================== LISTING TAB PAGE ============================== */

const ListingTabWhatsapps = ({}) => {
  const [isFollowUpData, setIsFollowUpData] = useState<any>();
  const [noteDetails, setNoteDetails] = useState<any>();
  const [data, setData] = useState<any>([]);
  const { user } = useAuth();
  const campaignType = useCampaignType();

  useEffect(() => {
    const tabsData = [
      // {
      //   id: "1",
      //   title: "History",
      //   icon: "call-history2",
      //   component: () => (
      //     <CallHistory
      //       setIsFollowUpData={setIsFollowUpData}
      //       setNoteData={setNoteDetails}
      //       activeTab={activeTab}
      //     />
      //   ),
      // }
    ];
    if (isWhatsAppEnabled(user) && campaignType === "blended") {
      tabsData.push({
        id: "2",
        title: "Conversation",
        icon: "chat-notification",
        component: () => <Conversation />,
      });
    }
    setData([...tabsData]);
  }, [campaignType]);

  if (!!noteDetails)
    return (
      <>
        <NoteAdd noteData={noteDetails} setNoteData={setNoteDetails} />
      </>
    );

  return (
    <>
      {isWhatsAppEnabled(user) && campaignType === "blended" && (
        <div className="border-dark-800 bg-white h-[calc(100%-5.8vh)]">
          <div className="bg-layout 3xl:px-6 py-2.5 px-4 flex justify-between items-center h-[5.8vh]">
            <span className="3xl:text-base text-xs text-heading font-bold">
              Conversation
            </span>
          </div>
          <div className="h-[calc(100%-5.8vh)]">
            <Conversation />
          </div>
        </div>
      )}{" "}
      <FollowUpModal
        visible={!!isFollowUpData}
        onCancleClick={() => {
          setIsFollowUpData("");
        }}
        data={isFollowUpData}
        fromCallCenter
      />
    </>
  );
};

export default ListingTabWhatsapps;
