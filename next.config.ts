import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@coinbase/cdp-sdk', '@base-org/account'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com',
      },
      {
        protocol: 'https',
        hostname: 'coin-images.coingecko.com',
      },
    ],
  },
};

export default nextConfig;
