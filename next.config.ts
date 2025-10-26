import type { NextConfig } from "next";

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
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
