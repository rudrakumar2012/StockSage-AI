import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add transpilePackages for large icon and animation libraries to help with tree-shaking
  transpilePackages: ['lucide-react', 'framer-motion', '@phosphor-icons/react'],
  
  // This tells TypeScript to ignore errors during the 'next build'
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // This tells ESLint to ignore errors during the 'next build'
  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@phosphor-icons/react'],
  }
};

export default nextConfig;