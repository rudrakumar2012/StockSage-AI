import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['drizzle-orm', 'better-sqlite3'],
  
  // This tells TypeScript to ignore errors during the 'next build'
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // This tells ESLint to ignore errors during the 'next build'
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;