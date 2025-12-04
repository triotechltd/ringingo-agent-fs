"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Select } from "../forms";
import axios from "axios";
import { useAppDispatch } from "@/redux/hooks";
import { useAuth } from "@/contexts/hooks/useAuth";
import { Button, CheckBox, Input } from "../forms";
import Password from "../../components/forms/Password";
import getDomain from "@/utils/GetDoamin";
import globalLogout from "@/utils/globalLogout";
import { Registerer, RegistererState, UserAgent } from "sip.js";
import { useFormik } from "formik";
import * as Yup from "yup";
import Cookies from "js-cookie";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { LoginFormValues } from "@/types/loginTypes";
import { agentEntryAdd, userAllowedCampaign } from "@/redux/slice/authSlice";
import { onSetUserEntry } from "@/redux/slice/commonSlice";
import { Danger } from "@/redux/services/toasterService";
import Icon from "../ui-components/Icon";

const WSS_URL = process.env.WSS_URL;
const baseUrl = `${process.env.BASE_URL}`;

const LoginForm = () => {
  const { login, logout } = useAuth();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [campaignOptions, setCampaignOptions] = useState<
    Array<{ label: string; value: string }>
  >([]);

  const onEyeClick = () => setShowPassword(!showPassword);
  const domain = getDomain();
  const tenantPortal: any = domain;
  // const tenantPortal: any = process.env.TENANT_PORTAL_DOMAIN;

  const initialValues: LoginFormValues = {
    username: "",
    password: "",
    tenant_domain: tenantPortal,
    rememberMe: false,
    browserToken: "",
    campaign_uuid: "",
  };

  const validationSchema = Yup.object<LoginFormValues>({
    username: Yup.string().required("Please enter your username"),
    password: Yup.string().required("Please enter your password"),
    campaign_uuid: Yup.string().required("Please select a campaign"),
  });

  const fetchAllowedCampaigns = async (username: string) => {
    if (!username) return;
    try {
      const res: any = await dispatch(
        userAllowedCampaign({ params: { username } })
      ).unwrap();
      setCampaignOptions(res);
    } catch (error) {
      console.error("Failed to fetch allowed campaigns", error);
    }
  };

  const sipRegistration = (user: any) => {
    let userAgent: any;
    let callScreen = "false";
    let username = user?.agent_detail?.extension_details[0]?.username;
    let password = user?.agent_detail?.extension_details[0]?.password;
    // let domain = "itsmycc-bytebran.local";
    // let domain = "192.168.1.25";
    let domain = user?.agent_detail?.tenant[0]?.domain;
    var UAURI = UserAgent.makeURI("sip:" + username + "@" + domain);
    console.log("UAURI=====>", UAURI);
    if (!UAURI) {
      throw new Error("Failed to create UserAgent URI ....");
    }
    const userOptions: any = {
      uri: UAURI,
      authorizationPassword: password,
      authorizationUsername: username,
      transportOptions: {
        server: WSS_URL,
        traceSip: true,
      },
      register: true,
      noAnswerTimeout: 60,
      userAgentString: "ASTPP | WEBRTC ",
      dtmfType: "info",
      displayName: username,
      activeAfterTransfer: false, //	Die when the transfer is completed
      logBuiltinEnabled: false, //	Boolean - true or false - If true throws console logs
    };
    console.log(userOptions);
    userAgent = new UserAgent(userOptions);
    userAgent
      .start()
      .then(() => {
        console.log("Connected ....");
        console.log(userAgent);
        //	Create register object
        const registerer = new Registerer(userAgent);
        registerer.stateChange.addListener(
          (registrationState: RegistererState) => {
            switch (registrationState) {
              case RegistererState.Registered:
                console.log("Registered ....");
                Cookies.set("username", username);
                Cookies.set("password", password);
                Cookies.set("domain", domain);
                Cookies.set("authenticated", "true");
                // window.setTimeout(function () {
                //     window.location.href = "/";
                // }, 2000);
                break;
              case RegistererState.Unregistered:
                console.log("Unregistered ....");
                break;
              case RegistererState.Terminated:
                console.log("Terminated ....");
                break;
              default:
                console.log(
                  "Could not identified registration state .... ",
                  registrationState
                );
                break;
            }
          }
        );
        if (callScreen !== "true") {
          registerer
            .register()
            .then((request) => {
              console.log("Successfully sent REGISTER request .... ", request);
            })
            .catch((error: any) => {
              console.log("Failed to send REGISTER request .... ", error);
            });
        }
      })
      .catch((error: any) => {
        console.log("Failed to connect user agent .... ", error);
      });
  };

  const sendLogout = (
    browserToken: any,
    user_uuid: any,
    newToken: any,
    user: any
  ) => {
    const socket = io(baseUrl, {
      query: { token: browserToken, uuid: user_uuid, new_token: newToken },
    });

    socket.on("logout", () => {
      globalLogout(logout, user);
      console.log("Received logout event. Logging out...");
    });
  };

  const onSubmit = async (values: LoginFormValues) => {
    setErrorMsg(null);
    try {
      setIsLoading(true);
      const browserToken = uuidv4();
      const campaignUUID = values.campaign_uuid;
      const res: any = await login(
        values.username,
        values.password,
        values.tenant_domain,
        browserToken,
        values.rememberMe,
        campaignUUID
      );

      if (res?.data?.access_token) {
        if (values.rememberMe) {
          Cookies.set("rememberMe", "true", { expires: 7 });
          Cookies.set("username", values.username, { expires: 7 });
        } else {
          Cookies.remove("rememberMe");
          Cookies.remove("username");
        }

        const payload = { login_status: "0" };
        const response: any = await dispatch(agentEntryAdd(payload)).unwrap();

        if (response?.statusCode === 200 || response?.statusCode === 201) {
          dispatch(onSetUserEntry("login-entry"));
        }

        sendLogout(
          res.data.agent_detail.browserToken,
          res.data.agent_detail.uuid,
          browserToken,
          res.data
        );

        sipRegistration(res?.data);
        Cookies.set("is_call_start", "1");
      } else if (res?.data?.statusCode === 403) {
        setErrorMsg(res?.data?.data);
      } else {
        Danger(res?.data?.data);
      }
    } catch (e: any) {
      console.error("Login Error --->", e?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const {
    values,
    touched,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    const savedUsername = Cookies.get("username") || "";
    const rememberMe = Cookies.get("rememberMe") === "true";

    if (rememberMe) {
      setFieldValue("username", savedUsername);
      setFieldValue("rememberMe", true);
    }
  }, [setFieldValue]);

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="flex rounded-2xl shadow-lg overflow-hidden max-w-3xl w-full bg-white">
        {/* ✅ LEFT SECTION (Added same as first code) */}
        <div className="w-1/2 bg-[#f5f6fa] p-6 flex flex-col  rounded-l-2xl relative ">
          {/* Logo moved to top */}
          <div className="flex justify-center items-center mt-3">
            <Icon
              name="MenuLogoExpandedImage"
              width={180}
              height={50}
              alt="Logo"
            />
          </div>

          <div>
            <h2 className="text-[26px] font-bold text-gray-800 leading-snug mt-8">
              Find Latest Updates Here!
            </h2>
            <p className="text-sm text-gray-600  leading-relaxed mt-4">
              Now check added displays on the status page along with other
              technical upgrades. Stay updated with our latest features and
              performance improvements.
            </p>

            {/* <div className="mt-8 flex gap-4">
              <img
                src="/assets/images/google-play.png"
                alt="Google Play"
                className="w-[120px] cursor-pointer"
              />
              <img
                src="/assets/images/app-store.png"
                alt="App Store"
                className="w-[120px] cursor-pointer"
              />
            </div> */}
            <div className="mt-6 border-t border-gray-300 pt-4">
              <h3 className="text-[16px] font-semibold text-gray-800 mb-1">
                📢 What’s New:
              </h3>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>Enhanced dashboard performance</li>
                <li>Improved security & reliability</li>
                <li>New responsive layout for better experience</li>
                <li>Faster load times with optimized codebase</li>
                <li>Fresh modern UI with smoother navigation</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-l border-gray-400 "></div>

        {/* ✅ RIGHT SECTION (your original login form untouched) */}
        <div className="w-1/2 p-6 flex flex-col justify-center bg-[#f5f6fa]">
          {/* <div className="flex justify-center mb-4">
            <Icon name="MenuLogoExpandedImage" height={50} width={220} alt="Logo" />
          </div> */}

          <h2 className="text-[28px] font-bold mb-6 text-center text-[#111827]">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5 ">
            <Input
              isLogin
              icon="userLogin"
              name="username"
              label={
                <>
                  User Name <span className="text-red-500">*</span>
                </>
              }
              value={values.username}
              touched={touched}
              errors={errors}
              onChange={handleChange}
              onBlur={(e) => {
                handleBlur(e);
                fetchAllowedCampaigns(e.target.value);
              }}
              isInfo={false}
              noSpace
            />

            <Password
              className=" text-sm"
              name="password"
              label={
                <>
                  Password <span className="text-red-500">*</span>
                </>
              }
              value={values.password}
              touched={touched}
              errors={errors}
              onChange={handleChange}
              onBlur={handleBlur}
              isInfo={false}
            />

            <div className="flex justify-end">
              {/* <div className="flex items-center pb-0">
                <CheckBox
                  label="Remember Me"
                  checked={values.rememberMe}
                  onChange={(checked: boolean) =>
                    setFieldValue("rememberMe", checked)
                  }
                />
              </div> */}
              <Link
                href="/forgot-password"
                className="text-[#322996] text-xs font-light hover:underline"
              >
                Forgot password ?
              </Link>
            </div>

            <Select
              className="bg-white text-sm"
              label={
                <>
                  <div className="!text-[#322996] !text-xs">
                    Select Campaign {" "}<span className="text-red-500 text-sm">*</span>
                  </div>
                </>
              }
              name="campaign_uuid"
              // placeholder="Select Campaign"
              options={campaignOptions}
              value={values.campaign_uuid}
              touched={touched}
              errors={errors}
              isInfo={false}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFieldValue("campaign_uuid", e.target.value)
              }
            />

            <Button
              text="LOGIN"
              className="w-full rounded-md bg-button-background py-2.5 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              type="submit"
              style="save"
              icon="LoginIcon"
              isLoading={isLoading}
              disabled={isLoading}
            />

            <div className="text-center mt-4">
              <p className="text-[10px] text-gray-500 mt-4">
                By clicking to continue, you agree to our{" "}
                <a href="/dummy.pdf" target="_blank" rel="noopener noreferrer" className="font-bold text-[#322996] hover:underline">
                  Terms & Condition
                </a>
              </p>
              <p className="text-xs text-gray-600 text-center mt-4">
                Powered by{" "}
                <span className="text-[#322996] font-bold">Ringingo</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
