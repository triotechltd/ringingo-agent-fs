// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   /* config options here */
//   env: {
//     NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL_APP,
//     TENANT_PORTAL_DOMAIN: process.env.TENANT_PORTAL_DOMAIN,
//     SIDEPANEL_1: process.env.SIDEPANEL_1,
//     SIDEPANEL_2: process.env.SIDEPANEL_2,
//     SIDEPANEL_3: process.env.SIDEPANEL_3,
//     FOOTER: process.env.FOOTER,
//     TITLE: process.env.TITLE,
//     DESCRIPTION: process.env.DESCRIPTION,
//     LOGIN: process.env.LOGIN,
//     BASE_URL: process.env.BASE_URL,
//     WSS_URL: process.env.WSS_URL,
//     CHAT_SOCKET_URL: process.env.CHAT_SOCKET_URL,
//     EXPANDED_LOGO: process.env.EXPANDED_LOGO,
//     COLLAPSED_LOGO: process.env.COLLAPSED_LOGO
//   },
//   output: "standalone",
//   reactStrictMode: false,
// };

// module.exports = nextConfig;


/** @type {import('next').NextConfig} */
// const withBundleAnalyzer = require("@next/bundle-analyzer")({
//   enabled: process.env.ANALYZE === "true",
// });

const nextConfig = {
  //experimental: {
  //  appDir: true,
  //},
   output: "standalone",
 // compress: true,
  //swcMinify: true,
  //productionBrowserSourceMaps: false, // disable source maps in prod to reduce size
  env: {
    NEXT_PUBLIC_SITE_URL: "https://localhost",
    TENANT_PORTAL_DOMAIN: "46.62.223.118",
    SIDEPANEL_1: "Your Unified",
    SIDEPANEL_2: "Communications Platform.",
    SIDEPANEL_3: "Smart Contact Center platform for High performance teams.",
    FOOTER: "CALL CENTER, All rights reserved.",
    TITLE: "CALL CENTER",
    DESCRIPTION: "Smart Contact Center platform for High performance teams.",
    EXPANDED_LOGO: "/assets/images/ringingo_expanded_logo.svg",
    COLLAPSED_LOGO: "/assets/images/ringingo_collapsed_logo.svg",
    BASE_URL:"https://ccapi.dialiqo.com",
    WSS_URL:  "wss://ccapi.dialiqo.com:7443",
    // WSS_URL: 'wss://192.168.1.25:8081',
    // BASE_URL: 'https://localhost:5000',
  },
  // webpack(config) {
  //   // Reduce moment.js size by ignoring locales
  //   config.plugins.push(
  //     new (require("webpack").IgnorePlugin)({
  //       resourceRegExp: /^\.\/locale$/,
  //       contextRegExp: /moment$/,
  //     })
  //   );
  //   return config;
  // },
};

module.exports = nextConfig;
