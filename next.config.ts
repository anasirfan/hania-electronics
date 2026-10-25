import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Optimizer stays off in local dev (Turbopack on Windows was returning
    // null for valid images). Production resizes the originals — some
    // banners are 4MB+ JPGs and were being sent to phones at full size.
    unoptimized: process.env.NODE_ENV !== "production",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/products", destination: "/shop", permanent: true },
      // Only page slugs (no file extension) — do NOT catch /products/*.webp
      {
        source: "/products/:slug([^/.]+)",
        destination: "/product/:slug",
        permanent: true,
      },
      {
        source: "/categories/:id([^/.]+)",
        destination: "/shop",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
