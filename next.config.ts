import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['lucide-react', 'framer-motion', 'recharts'],
  serverExternalPackages: ['drizzle-orm'],
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'recharts', 'sonner'],
  }
};

export default nextConfig;
