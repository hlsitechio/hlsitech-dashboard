import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: 'standalone',

  images: {
    domains: ['ggppnyylqpjqutzbdhmm.supabase.co'],
    unoptimized: process.env.NODE_ENV === 'production',
  },

  experimental: {
    serverActions: {
      allowedOrigins: ['hlsitech.com', 'dashboard.hlsitech.com', 'localhost:3000']
    }
  },

  webpack(config) {
    // Configure path alias resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };

    // SVG handling
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

export default nextConfig;
