"use client";
import { useEffect, useRef, useState } from "react";
import CrmInformation from "@/components/call-center-components/phone/CrmInformation";
import LeadInformationTab from "@/components/call-center-components/phone/LeadInformationTab";
import ListingTab from "@/components/call-center-components/phone/ListingTab";
import UnreadList from "@/components/call-center-components/phone/UnreadList";
import WaitingCalls from "@/components/call-center-components/phone/WaitingCalls";
import { useAppDispatch } from "@/redux/hooks";
import {
  getActiveUnreadChat,
  onUnSelectCampaign,
} from "@/redux/slice/chatSlice";
import {
  onSelectCampaign,
  onSelectCampaignMode,
  onSetCampaignType,
  setCampaignFetched,
  setCampaignUpdated,
  useCampaignFetched,
  useCampaignUpdated,
  useSelectedCampaign,
  useUserEntry,
} from "@/redux/slice/commonSlice";
import { SocketProvider } from "@/contexts/chatSocket/SocketProvider";
import { useAuth } from "@/contexts/hooks/useAuth";
import { isWhatsAppEnabled } from "@/components/helperFunctions";
import {
  getCampaign,
  getCampaignList,
  getCampaignOption,
  updateAgentCampaign,
} from "@/redux/slice/campaignSlice";
import ActiveList from "@/components/call-center-components/phone/ActiveList";
import ListingTabWhatsapps from "@/components/call-center-components/phone/ListingTabWhatsapps";
/* ============================== PHONE PAGE ============================== */

export default function Phone() {
  const [activeId, setActiveId] = useState<string>("2");
  const selectedCampaign = useSelectedCampaign();
  const campaignFetched = useCampaignFetched();
  const campaignUpdated = useCampaignUpdated();
  const userEntry = useUserEntry();
  console.log("userEntry", userEntry);

  const dispatch = useAppDispatch();

  const [initialValues, setInitialValues] = useState<any>({});
  // // RADIO OPTIONS
  const options = [
    { label: "Log In", value: "0", isDisabled: false },
    //{ label: "Break", value: "1", isDisabled: false },
    { label: "Log Out", value: "2", isDisabled: false },
  ];
  const getOptions = (status: string) => {
    if (status === "0") {
      return options;
    } else if (status === "1") {
      let newOption = options.map((x) => {
        return {
          ...x,
          isDisabled: x.value === "2" ? true : false,
        };
      });
      return newOption;
    } else if (status === "2") {
      let newOption = options.map((x) => {
        return {
          ...x,
          isDisabled: x.value === "1" ? true : false,
        };
      });
      return newOption;
    } else {
      return options;
    }
  };

  const onGetCampaign = async () => {
    try {
      const response: any = await dispatch(getCampaignList()).unwrap();
      const res: any = await dispatch(getCampaign({ list: "all" })).unwrap();
      console.log("selectedCampaignselectedCampaign response ", response);
      console.log("selectedCampaignselectedCampaign resss", res);
      if (res && res?.statusCode === 200) {
        let newObj = {};
        let newData: any = [];
        let inboundData =
          res?.data?.inbound_campaign && res?.data?.inbound_campaign.length
            ? res?.data?.inbound_campaign.map((x: any) => {
              return {
                ...x,
                dataType: "inbound",
              };
            })
            : [];
        let outboundData =
          res?.data?.outbound_campaign && res?.data?.outbound_campaign.length
            ? res?.data?.outbound_campaign.map((x: any) => {
              return {
                ...x,
                dataType: "outbound",
              };
            })
            : [];
        let blendedData =
          res?.data?.blended_campaign && res?.data?.blended_campaign.length
            ? res?.data?.blended_campaign.map((x: any) => {
              return {
                ...x,
                dataType: "blended",
              };
            })
            : [];
        let prepareData = [...inboundData, ...outboundData, ...blendedData];

        prepareData.forEach((val: any) => {
          console.log(
            "selectedCampaignselectedCampaign preparedataaaa",
            prepareData
          );
          if (response?.data?.length) {
            response.data?.forEach((value: any) => {
              console.log("selectedCampaignselectedCampaign valuessss", value);
              if (value._id.campaign_uuid === val.uuid) {
                newObj = {
                  ...newObj,
                  [val.uuid]: value?.login_status,
                };
                newData.push({
                  ...val,
                  options: getOptions(value?.login_status) || [],
                });
              }
            });
          } else {
            newObj = { ...newObj, [val.uuid]: "2" };
            newData.push({
              ...val,
              options: getOptions("2") || [],
            });
          }
        });
        console.log("selectedCampaignselectedCampaign newobjj", newObj);
        let Ids: any = [];
        newData?.map((x: any) => {
          Ids.push(x.uuid);
        });
        prepareData.map((val: any) => {
          if (!Ids.includes(val.uuid)) {
            newObj = { ...newObj, [val.uuid]: "2" };
            newData.push({
              ...val,
              options: getOptions("2") || [],
            });
          }
        });
        setInitialValues(newObj);
      }
    } catch (error: any) {
      console.log("Get campaign list Err ---->", error?.message);
    }
  };

  const onGetCampaignOption = async () => {
    try {
      console.log("selectedCampaignselectedCampaign before ");
      const result = await dispatch(
        getCampaignOption({ list: "all" })
      ).unwrap();
      console.log("selectedCampaignselectedCampaign after ", result);

      if (result?.data?.length > 0) {
        dispatch(onSelectCampaignMode(result?.data[0]?.dial_method));
        dispatch(
          onSetCampaignType(
            result?.data[0]?.campaign_type === "0"
              ? "outbound"
              : result.data[0]?.campaign_type === "2"
                ? "blended"
                : "inbound"
          )
        );
        dispatch(onSelectCampaign(result.data[0].uuid));
      }
    } catch (error: any) {
      console.log("Get campaign list Err ---->", error?.message);
    }
  };

  const campaignUpdate = async () => {
    try {
      let payload: any = {
        campaigns_details: [],
        feature: userEntry ? userEntry : "login-entry",
      };
      console.log("initialValues", initialValues);
      Object.entries(initialValues)?.map(([key, val]: any) => {
        let obj: any = {
          campaign_uuid: key,
          login_status: val,
        };
        payload["campaigns_details"].push(obj);
      });
      console.log("selectedCampaignselectedCampaign  payload", payload);
      let res: any = await dispatch(updateAgentCampaign(payload)).unwrap();
      if (res && res.statusCode === 200) {
        // Success(res.data);
        onGetCampaignOption();
        // dispatch(onSelectCampaign("44fafdc6-5a87-47f3-8498-5656953cae6e"))
        // Cookies.set("campaign_modal", "1", { expires: 1 });
        // setIsUpdateLoading(false);
        // liveChatOption(1);
      }
    } catch (error: any) {
      console.log("error while updating campaign", error.message);
    }
  };

  useEffect(() => {
    if (userEntry === "login-entry" && !campaignFetched) {
      dispatch(setCampaignFetched(true));
      onGetCampaign();
    }
  }, [userEntry, campaignFetched]);

  useEffect(() => {
    if (Object.keys(initialValues).length && !campaignUpdated) {
      dispatch(setCampaignUpdated(true));
      campaignUpdate();
    }
  }, [initialValues, campaignUpdated]);

  console.log("selectedCampaignselectedCampaign", selectedCampaign);
  // dispatch(onSelectCampaignMode("2"));
  // dispatch(onSetCampaignType("outbound"));
  // dispatch(onSelectCampaign("44fafdc6-5a87-47f3-8498-5656953cae6e"));
  const { user } = useAuth();

  useEffect(() => {
    if (selectedCampaign) {
      dispatch(
        getActiveUnreadChat({ campaign_uuid: selectedCampaign })
      ).unwrap();
    } else {
      dispatch(onUnSelectCampaign());
    }
  }, [selectedCampaign]);

  const [active, setActive] = useState("whatsapp");

  const tabs = [
    { id: "whatsapp", label: "WhatsApp", subtitle: "Chats", badge: 3 },
    { id: "instagram", label: "Instagram", subtitle: "Messages", badge: 1 },
    { id: "facebook", label: "Facebook", subtitle: "Inbox", badge: 0 },
    { id: "twitter", label: "Twitter", subtitle: "DMS", badge: 2 },
  ];

  return (
    // chat socket ::yaksh::
    <SocketProvider>
      {/* Tabs header */}
      <div className="flex gap-4 items-center border-b p-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#4DA6FF] ${active === t.id ? "bg-indigo-50 shadow-sm" : "hover:bg-gray-100"}`}
            aria-pressed={active === t.id}
            role="tab"
            aria-selected={active === t.id}
            tabIndex={0}
          >
            {/* Simple circle as channel indicator */}
            <span
              className={`w-3 h-3 rounded-full ${t.id === "whatsapp"
                ? "bg-green-500"
                : t.id === "instagram"
                  ? "bg-pink-500"
                  : t.id === "facebook"
                    ? "bg-blue-600"
                    : "bg-sky-400"
                }`}>
            </span>


            <div className="text-left">
              <div className="text-sm font-medium">{t.label}</div>
              {/* <div className="text-xs text-gray-500">{t.subtitle}</div> */}
            </div>


            {typeof t.badge === "number" && (
              <span
                className={`ml-2 ml-auto inline-flex items-center justify-center px-2 py-0.5 text-xs rounded-full font-medium ${t.badge > 0 ? "bg-[#4DA6FF] text-white" : "bg-gray-100 text-gray-600"
                  }`}
              >
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>
      <div
        className="grid gap-4 min-h-[calc(100vh-120px)] bg-[#f8f9fc] pt-4"
        style={{ gridTemplateColumns: "25% 75%" }}
      >
        {/* LEFT PANEL (Now has history instead of ActiveList) */}
        <div className="flex flex-col gap-4 overflow-y-auto ">
          {/* <div className="bg-white rounded-2xl shadow-md p-4">
            <WaitingCalls />
          </div> */}

          {/* <div className="bg-white rounded-2xl shadow-md p-5 flex-1 min-h-[360px]">
            <ListingTab activeId={activeId} setActiveId={setActiveId} activeTab="" />
          </div> */}
          <div className="bg-white rounded-2xl shadow-md p-4 min-h-[400px]">
            <ActiveList
              setActiveId={setActiveId}
              sectionClass="h-full"
              sectionBodyClass="h-[calc(100%-2rem)]"
            />
          </div>

          {/* {isWhatsAppEnabled(user) && (
            <div className="bg-white rounded-2xl shadow-md p-4 min-h-[200px]">
              <UnreadList sectionClass="h-full" sectionBodyClass="h-[calc(100%-1.5rem)]" />
            </div>
          )} */}
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col gap-4 overflow-y-auto ">
          {/* Top Row: ActiveList + LeadInformationTab */}
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "68% 30%" }}
          >
            <div className="bg-white rounded-2xl shadow-md p-5 flex-1 min-h-[360px]">
              <ListingTabWhatsapps />
            </div>
            {/* <div className="bg-white rounded-2xl shadow-md p-4 min-h-[400px]">
              <ActiveList
                setActiveId={setActiveId}
                sectionClass="h-full"
                sectionBodyClass="h-[calc(100%-2rem)]"
              />
            </div> */}
            <div className="bg-white rounded-2xl shadow-md p-4 max-h-[400px]">
              <LeadInformationTab />
            </div>
          </div>

          {/* Full-width CrmInformation */}
          {/* <div className="bg-white rounded-2xl shadow-md p-4 min-h-[220px]">
            <CrmInformation />
          </div> */}
        </div>
      </div>
    </SocketProvider>
  );
}
