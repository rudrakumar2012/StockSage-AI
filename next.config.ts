import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add transpilePackages for large icon and animation libraries to help with tree-shaking
  transpilePackages: ['lucide-react', 'framer-motion'],
  
  // This tells TypeScript to ignore errors during the 'next build'
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // This tells ESLint to ignore errors during the 'next build'
  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  }
};

export default nextConfig;