/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.meetowner.in",
      }
    ],
  },
};

export default nextConfig;
