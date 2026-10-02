import {
  categoryRepository,
  productRepository as shopProductRepository,
} from "@/server/repositories";
import {
  mapShopCategory,
  mapShopProduct,
} from "@/features/products/map-from-shop";
import type { Category, Product } from "@/features/products/types";
import { purposes } from "@/data/catalog/purposes";
import type { PurposeOption } from "@/features/products/types";

async function catalogMaps() {
  const [shopProducts, shopCategories] = await Promise.all([
    shopProductRepository.list({ publishedOnly: true }),
    categoryRepository.list(false),
  ]);
  const slugById = new Map(shopCategories.map((c) => [c.id, c.slug]));
  const products = shopProducts.map((p) =>
    mapShopProduct(p, slugById.get(p.categoryId) ?? p.categoryId),
  );
  const categories = shopCategories.map(mapShopCategory);
  return { products, categories, shopCategories };
}

export const productRepository = {
  async getAll(): Promise<Product[]> {
    const { products } = await catalogMaps();
    return products;
  },

  async getFeatured(): Promise<Product[]> {
    const { products } = await catalogMaps();
    return products.filter((p) => p.featured);
  },

  async getBestsellers(): Promise<Product[]> {
    const { products } = await catalogMaps();
    return products.filter((p) => p.bestseller);
  },

  async getBySlug(slug: string): Promise<Product | undefined> {
    const { products } = await catalogMaps();
    return products.find((p) => p.slug === slug);
  },

  async getByCategory(category: string): Promise<Product[]> {
    const { products } = await catalogMaps();
    return products.filter((p) => p.category === category);
  },

  async getByPurpose(purpose: string): Promise<Product[]> {
    const { products } = await catalogMaps();
    return products.filter((p) => p.purposes.includes(purpose as never));
  },

  async getRelated(product: Product, limit = 4): Promise<Product[]> {
    const { products } = await catalogMaps();
    return products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, limit);
  },

  async getCategories(): Promise<Category[]> {
    const { categories } = await catalogMaps();
    return categories;
  },

  async getPurposes(): Promise<PurposeOption[]> {
    return purposes;
  },
};
