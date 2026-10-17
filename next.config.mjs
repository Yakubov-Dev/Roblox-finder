/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: { remotePatterns: [{ protocol: "https", hostname: "*.rbxcdn.com" }, { protocol: "https", hostname: "tr.rbxcdn.com" }] }
};
export default nextConfig;