import { categories } from "@/data/catalog/categories";
import { products } from "@/data/catalog/products";
import { purposes } from "@/data/catalog/purposes";
import type {
  Category,
  CategoryId,
  Product,
  Purpose,
  PurposeOption,
} from "@/features/products/types";

export interface ProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: string): Promise<Product | undefined>;
  getBySlug(slug: string): Promise<Product | undefined>;
  getBestsellers(): Promise<Product[]>;
  getFeatured(): Promise<Product[]>;
  getByCategory(category: CategoryId): Promise<Product[]>;
  getByPurpose(purpose: Purpose): Promise<Product[]>;
  search(query: string): Promise<Product[]>;
  getCategories(): Promise<Category[]>;
  getPurposes(): Promise<PurposeOption[]>;
}

class LocalProductRepository implements ProductRepository {
  async getAll(): Promise<Product[]> {
    return products;
  }

  async getById(id: string): Promise<Product | undefined> {
    return products.find((p) => p.id === id);
  }

  async getBySlug(slug: string): Promise<Product | undefined> {
    return products.find((p) => p.slug === slug);
  }

  async getBestsellers(): Promise<Product[]> {
    return products.filter((p) => p.bestseller);
  }

  async getFeatured(): Promise<Product[]> {
    return products.filter((p) => p.featured);
  }

  async getByCategory(category: CategoryId): Promise<Product[]> {
    return products.filter((p) => p.category === category);
  }

  async getByPurpose(purpose: Purpose): Promise<Product[]> {
    return products.filter((p) => p.purposes.includes(purpose));
  }

  async search(query: string): Promise<Product[]> {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.includes(q),
    );
  }

  async getCategories(): Promise<Category[]> {
    return categories;
  }

  async getPurposes(): Promise<PurposeOption[]> {
    return purposes;
  }
}

export const productRepository: ProductRepository =
  new LocalProductRepository();
