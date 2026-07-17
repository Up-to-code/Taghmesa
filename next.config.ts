import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: { authInterrupts: true },
  allowedDevOrigins: ["192.168.1.14", "127.0.0.1"],
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
