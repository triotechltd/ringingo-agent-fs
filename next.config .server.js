/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_SITE_URL: "cc.xcessunify.local",
    TENANT_PORTAL_DOMAIN: "192.168.1.28", // do not change
    SIDEPANEL_1: "Your Unified",
    SIDEPANEL_2: "Communications Platform.",
    SIDEPANEL_3: "Smart Contact Center platform for High performance teams.",
    FOOTER: "ItsMyCallcenter, All rights reserved.",
    TITLE: "CALL CENTER",
    DESCRIPTION: "Smart Contact Center platform for High performance teams.",
    LOGIN: "Login to Agent",

    // BASE_URL:'https://localhost:5000',
    // WSS_URL: 'wss://192.168.1.25:8081',
    // CHAT_SOCKET_URL     : 'https://lab.test.io:5002',
    BASE_URL: "https://cc.xcessunify.local:5001",
    WSS_URL: "wss://cc.xcessunify.local:7443",
    CHAT_SOCKET_URL: "https://lab.test.io:5002",
  },
  output: "standalone",
};

module.exports = nextConfig;
