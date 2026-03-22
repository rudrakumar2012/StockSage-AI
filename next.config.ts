import type { NextConfig } from "next";
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

const nextConfig: NextConfig = {
  // Use rewrites to trigger the Cloudflare dev platform setup
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      // This allows Next.js to "see" your D1 database locally
      await setupDevPlatform().catch(console.error);
    }
    return [];
  },
};

export default nextConfig;