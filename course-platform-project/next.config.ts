import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    dynamicIO: true,
    authInterrupts: true,
  },
  images: {
    domains: ["media.geeksforgeeks.org"],
  },
};

export default nextConfig;
