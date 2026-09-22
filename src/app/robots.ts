import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/admin", "/order/confirmed"],
    },
    sitemap: "https://haniaelectronics.pk/sitemap.xml",
  };
}
