import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  transpilePackages: ["@texo/shared"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  ...(isStaticExport
    ? {
        output: "export" as const,
        basePath: "/Texo",
        assetPrefix: "/Texo",
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
