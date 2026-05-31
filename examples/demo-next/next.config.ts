import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    externalDir: true,
  },
  transpilePackages: [
    "@summoniq/summonflow-client-sdk",
    "@summoniq/summonflow-server-sdk",
  ],
};

export default nextConfig;
