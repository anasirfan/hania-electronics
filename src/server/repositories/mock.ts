import { nanoid } from "nanoid";
import type {
  AnnouncementBar,
  Banner,
  Category,
  HomepageConfig,
  Order,
  OrderStatus,
  Product,
} from "@/domain/types";
import { readStore, updateStore } from "@/server/db/store";

function now() {
  return new Date().toISOString();
}

export const mockCategoryRepository = {
  async list(includeInactive = false): Promise<Category[]> {
    const store = await readStore();
    return store.categories
      .filter((c) => includeInactive || c.active)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },
  async getById(id: string) {
    const store = await readStore();
    return store.categories.find((c) => c.id === id) ?? null;
  },
  async getBySlug(slug: string) {
    const store = await readStore();
    return store.categories.find((c) => c.slug === slug && c.active) ?? null;
  },
  async create(
    input: Omit<Category, "id" | "createdAt" | "updatedAt">,
  ): Promise<Category> {
    const category: Category = {
      ...input,
      id: `cat-${nanoid(8)}`,
      createdAt: now(),
      updatedAt: now(),
    };
    await updateStore((s) => {
      s.categories.push(category);
      return s;
    });
    return category;
  },
  async update(id: string, patch: Partial<Category>): Promise<Category | null> {
    let updated: Category | null = null;
    await updateStore((s) => {
      const i = s.categories.findIndex((c) => c.id === id);
      if (i === -1) return s;
      s.categories[i] = {
        ...s.categories[i],
        ...patch,
        id,
        updatedAt: now(),
      };
      updated = s.categories[i];
      return s;
    });
    return updated;
  },
  async delete(id: string): Promise<boolean> {
    let ok = false;
    await updateStore((s) => {
      const before = s.categories.length;
      s.categories = s.categories.filter((c) => c.id !== id);
      ok = s.categories.length < before;
      return s;
    });
    return ok;
  },
};

export const mockProductRepository = {
  async list(opts?: { publishedOnly?: boolean }): Promise<Product[]> {
    const store = await readStore();
    let list = store.products;
    if (opts?.publishedOnly !== false) {
      list = list.filter((p) => p.published);
    }
    return list;
  },
  async listAll(): Promise<Product[]> {
    const store = await readStore();
    return store.products;
  },
  async getById(id: string) {
    const store = await readStore();
    return store.products.find((p) => p.id === id) ?? null;
  },
  async getBySlug(slug: string) {
    const store = await readStore();
    return store.products.find((p) => p.slug === slug && p.published) ?? null;
  },
  async search(query: string): Promise<Product[]> {
    const q = query.trim().toLowerCase();
    const store = await readStore();
    if (!q) return store.products.filter((p) => p.published);
    const cats = store.categories;
    return store.products.filter((p) => {
      if (!p.published) return false;
      const cat = cats.find((c) => c.id === p.categoryId);
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        (cat?.name.toLowerCase().includes(q) ?? false)
      );
    });
  },
  async create(
    input: Omit<Product, "id" | "createdAt" | "updatedAt">,
  ): Promise<Product> {
    const product: Product = {
      ...input,
      id: `p-${nanoid(8)}`,
      createdAt: now(),
      updatedAt: now(),
    };
    await updateStore((s) => {
      s.products.push(product);
      return s;
    });
    return product;
  },
  async update(id: string, patch: Partial<Product>): Promise<Product | null> {
    let updated: Product | null = null;
    await updateStore((s) => {
      const i = s.products.findIndex((p) => p.id === id);
      if (i === -1) return s;
      s.products[i] = {
        ...s.products[i],
        ...patch,
        id,
        updatedAt: now(),
      };
      updated = s.products[i];
      return s;
    });
    return updated;
  },
  async delete(id: string): Promise<boolean> {
    let ok = false;
    await updateStore((s) => {
      const before = s.products.length;
      s.products = s.products.filter((p) => p.id !== id);
      ok = s.products.length < before;
      return s;
    });
    return ok;
  },
  async duplicate(id: string): Promise<Product | null> {
    const source = await this.getById(id);
    if (!source) return null;
    return this.create({
      ...source,
      name: `${source.name} (Copy)`,
      slug: `${source.slug}-copy-${nanoid(4)}`,
      sku: `${source.sku}-C${nanoid(3).toUpperCase()}`,
      published: false,
    });
  },
};

export const mockBannerRepository = {
  async list(activeOnly = false): Promise<Banner[]> {
    const store = await readStore();
    const nowIso = Date.now();
    return store.banners
      .filter((b) => {
        if (activeOnly && !b.active) return false;
        if (activeOnly && b.startDate && Date.parse(b.startDate) > nowIso)
          return false;
        if (activeOnly && b.endDate && Date.parse(b.endDate) < nowIso)
          return false;
        return true;
      })
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },
  async getById(id: string) {
    const store = await readStore();
    return store.banners.find((b) => b.id === id) ?? null;
  },
  async create(
    input: Omit<Banner, "id" | "createdAt" | "updatedAt">,
  ): Promise<Banner> {
    const banner: Banner = {
      ...input,
      id: `banner-${nanoid(8)}`,
      createdAt: now(),
      updatedAt: now(),
    };
    await updateStore((s) => {
      s.banners.push(banner);
      return s;
    });
    return banner;
  },
  async update(id: string, patch: Partial<Banner>): Promise<Banner | null> {
    let updated: Banner | null = null;
    await updateStore((s) => {
      const i = s.banners.findIndex((b) => b.id === id);
      if (i === -1) return s;
      s.banners[i] = { ...s.banners[i], ...patch, id, updatedAt: now() };
      updated = s.banners[i];
      return s;
    });
    return updated;
  },
  async delete(id: string): Promise<boolean> {
    let ok = false;
    await updateStore((s) => {
      const before = s.banners.length;
      s.banners = s.banners.filter((b) => b.id !== id);
      ok = s.banners.length < before;
      return s;
    });
    return ok;
  },
};

export const mockAnnouncementRepository = {
  async get(): Promise<AnnouncementBar> {
    const store = await readStore();
    return store.announcement;
  },
  async update(patch: Partial<AnnouncementBar>): Promise<AnnouncementBar> {
    let next!: AnnouncementBar;
    await updateStore((s) => {
      s.announcement = {
        ...s.announcement,
        ...patch,
        id: s.announcement.id,
        updatedAt: now(),
      };
      next = s.announcement;
      return s;
    });
    return next;
  },
};

export const mockHomepageRepository = {
  async get(): Promise<HomepageConfig> {
    const store = await readStore();
    return store.homepage;
  },
  async update(patch: Partial<HomepageConfig>): Promise<HomepageConfig> {
    let next!: HomepageConfig;
    await updateStore((s) => {
      s.homepage = {
        ...s.homepage,
        ...patch,
        sections: { ...s.homepage.sections, ...patch.sections },
        updatedAt: now(),
      };
      next = s.homepage;
      return s;
    });
    return next;
  },
};

export const mockOrderRepository = {
  async list(): Promise<Order[]> {
    const store = await readStore();
    return [...store.orders].sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
    );
  },
  async getById(id: string) {
    const store = await readStore();
    return store.orders.find((o) => o.id === id) ?? null;
  },
  async getByNumber(orderNumber: string) {
    const store = await readStore();
    return store.orders.find((o) => o.orderNumber === orderNumber) ?? null;
  },
  async track(orderNumber: string, phone: string) {
    const store = await readStore();
    const digits = phone.replace(/\D/g, "");
    return (
      store.orders.find(
        (o) =>
          o.orderNumber.toLowerCase() === orderNumber.toLowerCase() &&
          o.customer.phone.replace(/\D/g, "").endsWith(digits.slice(-10)),
      ) ?? null
    );
  },
  async create(
    input: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt">,
  ): Promise<Order> {
    const store = await readStore();
    const seq = 10000 + store.orders.length + 1;
    const order: Order = {
      ...input,
      id: `ord-${nanoid(10)}`,
      orderNumber: `HE-${seq}`,
      createdAt: now(),
      updatedAt: now(),
    };
    await updateStore((s) => {
      s.orders.push(order);
      return s;
    });
    return order;
  },
  async updateStatus(id: string, status: OrderStatus): Promise<Order | null> {
    let updated: Order | null = null;
    await updateStore((s) => {
      const i = s.orders.findIndex((o) => o.id === id);
      if (i === -1) return s;
      s.orders[i] = { ...s.orders[i], status, updatedAt: now() };
      updated = s.orders[i];
      return s;
    });
    return updated;
  },
};
