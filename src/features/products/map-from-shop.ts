import {
  getEffectivePrice,
  getPrimaryImage,
  type Category as ShopCategory,
  type Product as ShopProduct,
} from "@/domain/types";
import type { Category, Product } from "@/features/products/types";

export function mapShopCategory(c: ShopCategory): Category {
  return {
    id: c.slug,
    name: c.name,
    description: c.description,
    image: c.image,
  };
}

export function mapShopProduct(
  p: ShopProduct,
  categorySlug: string,
): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.shortDescription || p.description,
    pricePkr: getEffectivePrice(p),
    compareAtPkr: p.compareAtPrice ?? undefined,
    image: getPrimaryImage(p),
    category: categorySlug,
    purposes: ["home"],
    badge: p.bestSeller
      ? "bestseller"
      : p.newArrival
        ? "new"
        : p.saleBadge
          ? "sale"
          : undefined,
    inStock: p.stockStatus === "in_stock",
    features: p.features ?? [],
    featured: p.featured,
    bestseller: p.bestSeller,
  };
}
