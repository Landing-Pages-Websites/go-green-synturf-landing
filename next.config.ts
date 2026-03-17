import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.gogreensynturf.com",
      },
    ],
  },
  experimental: {
    ppr: false,
  },
};

export default nextConfig;
