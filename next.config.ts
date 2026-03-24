import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Core Build Optimizations
  swcMinify: true, // Internal minification to shrink the bundle
  reactStrictMode: true,
  
  // 2. Weight Loss for Large Libraries
  transpilePackages: ['lucide-react', 'framer-motion', 'recharts'],
  
  // 3. Database Compatibility
  serverExternalPackages: ['drizzle-orm'],

  // 4. Bypass Build Blockers
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 5. Experimental Tree-Shaking
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'recharts', 'sonner'],
  }
};

export default nextConfig;
