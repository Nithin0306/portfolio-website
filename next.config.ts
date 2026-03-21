import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // allow local /public images
    unoptimized: false,
  },
};

export default nextConfig;
