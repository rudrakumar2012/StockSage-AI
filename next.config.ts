import type { NextConfig } from "next";
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

const nextConfig: NextConfig = {
  // Fixes the 'experimental' warning and stabilizes Drizzle
  serverExternalPackages: ['drizzle-orm'],

  webpack: (config, { dev, isServer }) => {
    if (dev && isServer) {
      // Initialize the Cloudflare D1 bridge only once at startup
      setupDevPlatform().catch(console.error);
      
      // Prevent the compiler from being too aggressive on Windows
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      };
    }
    return config;
  },
};

export default nextConfig;