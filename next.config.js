/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL_APP,
    TENANT_PORTAL_DOMAIN: process.env.TENANT_PORTAL_DOMAIN,
    SIDEPANEL_1: process.env.SIDEPANEL_1,
    SIDEPANEL_2: process.env.SIDEPANEL_2,
    SIDEPANEL_3: process.env.SIDEPANEL_3,
    FOOTER: process.env.FOOTER,
    TITLE: process.env.TITLE,
    DESCRIPTION: process.env.DESCRIPTION,
    LOGIN: process.env.LOGIN,
    BASE_URL: process.env.BASE_URL,
    WSS_URL: process.env.WSS_URL,
    CHAT_SOCKET_URL: process.env.CHAT_SOCKET_URL,
    EXPANDED_LOGO: process.env.EXPANDED_LOGO,
    COLLAPSED_LOGO: process.env.COLLAPSED_LOGO
  },
  output: "standalone",
  reactStrictMode: false,
};

module.exports = nextConfig;
