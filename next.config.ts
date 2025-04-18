import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This will tell TypeScript to ignore all build errors during compilation
  typescript: {
    ignoreBuildErrors: true,
  },
  // This will tell ESLint to ignore all warnings during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Other options can go here
  images: {
    domains: [], // Agrega dominios externos si usas imágenes de CDN
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
