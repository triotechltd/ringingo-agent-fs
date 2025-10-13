const IS_SERVER = typeof window === "undefined";
export default function getDomain() {
    const baseURL = IS_SERVER
        ? process.env.NEXT_PUBLIC_SITE_URL!
        : window.location.hostname;
    return baseURL.toString();
}
