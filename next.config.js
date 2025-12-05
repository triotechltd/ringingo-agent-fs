/** @type {import('next').NextConfig} */
// const withBundleAnalyzer = require("@next/bundle-analyzer")({
//   enabled: process.env.ANALYZE === "true",
// });
 
const nextConfig = {
  output: "standalone",
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL_TENANT || "https://localhost",
    TENANT_PORTAL_DOMAIN: process.env.TENANT_PORTAL_DOMAIN || "10.180.67.147",
    SIDEPANEL_1: process.env.SIDEPANEL_1 || "Your Unified",
    SIDEPANEL_2: process.env.SIDEPANEL_2 || "Communications Platform.",
    SIDEPANEL_3: process.env.SIDEPANEL_3 || "Smart Contact Center platform for High performance teams.",
    FOOTER: process.env.FOOTER || "CALL CENTER, All rights reserved.",
    TITLE: process.env.TITLE || "CALL CENTER",
    DESCRIPTION: process.env.DESCRIPTION || "Smart Contact Center platform for High performance teams.",
    EXPANDED_LOGO: process.env.EXPANDED_LOGO || "/assets/images/ringingo_expanded_logo.svg",
    COLLAPSED_LOGO: process.env.COLLAPSED_LOGO || "/assets/images/ringingo_collapsed_logo.svg",
    BASE_URL: process.env.BASE_URL || "https://devapiapp.ringingo.com",
    WSS_URL: process.env.WSS_URL || "wss://devapiapp.ringingo.com:7443",
  },
};
 
module.exports = nextConfig;
 