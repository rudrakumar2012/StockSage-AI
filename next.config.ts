import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['drizzle-orm', 'better-sqlite3'],
};

export default nextConfig;