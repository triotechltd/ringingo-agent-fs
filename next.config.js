/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  env: {
	  NEXT_PUBLIC_SITE_URL: "https://agentapp.ringingo.com",
    TENANT_PORTAL_DOMAIN: "10.180.67.151", // do not change
    SIDEPANEL_1: "Your Unified",
    SIDEPANEL_2: "Communications Platform.",
    SIDEPANEL_3: "Smart Contact Center platform for High performance teams.",
    FOOTER: "ItsMyCallcenter, All rights reserved.",
    TITLE: "CALL CENTER",
    DESCRIPTION: "Smart Contact Center platform for High performance teams.",
    LOGIN: "Login to Agent",
    BASE_URL: "https://apiapp.ringingo.com:5000",
    //BASE_URL: "https://10.180.67.151:8444",
    //WSS_URL: "wss://10.180.67.151:7443",
    WSS_URL: "wss://apiapp.ringingo.com:7443",
    CHAT_SOCKET_URL: "https://lab.test.io:5002",
    EXPANDED_LOGO: "/assets/images/ringingo_expanded_logo.svg",
    COLLAPSED_LOGO: "/assets/images/ringingo_collapsed_logo.svg",
    // BASE_URL:'https://ccapi.bytebran.com:5000',
    // WSS_URL: 'wss://ccagent.bytebran.com:7443',
    // CHAT_SOCKET_URL     : 'https://lab.test.io:5002',
  },
  output: "standalone",
  reactStrictMode: false,
};

module.exports = nextConfig;
