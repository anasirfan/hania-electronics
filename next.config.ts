import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Local static assets — skip /_next/image optimizer (Turbopack/Windows
    // was returning null for valid JPG/WebP and breaking the storefront).
    unoptimized: true,
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
