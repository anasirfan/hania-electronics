import type { MetadataRoute } from "next";
import {
  categoryRepository,
  productRepository,
} from "@/server/repositories";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://haniaelectronics.pk";
  const [products, categories] = await Promise.all([
    productRepository.list({ publishedOnly: true }),
    categoryRepository.list(false),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/shop",
    "/cart",
    "/checkout",
    "/wishlist",
    "/track-order",
    "/about",
    "/contact",
    "/faq",
    "/become-a-dealer",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/shop" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  return [
    ...staticRoutes,
    ...categories.map((c) => ({
      url: `${base}/shop/${c.slug}`,
      lastModified: new Date(c.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((p) => ({
      url: `${base}/product/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}
