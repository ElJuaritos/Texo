import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@texo/shared"],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
