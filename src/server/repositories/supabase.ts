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
import { createServiceSupabase } from "@/server/supabase/client";
import {
  mapAnnouncement,
  mapBanner,
  mapCategory,
  mapHomepage,
  mapOrder,
  mapProduct,
  toDbAnnouncement,
  toDbBanner,
  toDbCategory,
  toDbHomepage,
  toDbOrder,
  toDbProduct,
} from "@/server/supabase/mappers";

function now() {
  return new Date().toISOString();
}

function throwDb(error: { message: string } | null, action: string): never {
  throw new Error(`Supabase ${action}: ${error?.message ?? "unknown error"}`);
}

export const supabaseCategoryRepository = {
  async list(includeInactive = false): Promise<Category[]> {
    const sb = createServiceSupabase();
    let q = sb.from("categories").select("*").order("sort_order", {
      ascending: true,
    });
    if (!includeInactive) q = q.eq("active", true);
    const { data, error } = await q;
    if (error) throwDb(error, "categories.list");
    return (data ?? []).map((row) => mapCategory(row as never));
  },
  async getById(id: string) {
    const sb = createServiceSupabase();
    const { data, error } = await sb
      .from("categories")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throwDb(error, "categories.getById");
    return data ? mapCategory(data) : null;
  },
  async getBySlug(slug: string) {
    const sb = createServiceSupabase();
    const { data, error } = await sb
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .eq("active", true)
      .maybeSingle();
    if (error) throwDb(error, "categories.getBySlug");
    return data ? mapCategory(data) : null;
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
    const sb = createServiceSupabase();
    const { data, error } = await sb
      .from("categories")
      .insert(toDbCategory(category))
      .select("*")
      .single();
    if (error) throwDb(error, "categories.create");
    return mapCategory(data);
  },
  async update(id: string, patch: Partial<Category>): Promise<Category | null> {
    const existing = await this.getById(id);
    if (!existing) return null;
    const next: Category = {
      ...existing,
      ...patch,
      id,
      updatedAt: now(),
    };
    const sb = createServiceSupabase();
    const { data, error } = await sb
      .from("categories")
      .update(toDbCategory(next))
      .eq("id", id)
      .select("*")
      .single();
    if (error) throwDb(error, "categories.update");
    return mapCategory(data);
  },
  async delete(id: string): Promise<boolean> {
    const sb = createServiceSupabase();
    const { error, count } = await sb
      .from("categories")
      .delete({ count: "exact" })
      .eq("id", id);
    if (error) throwDb(error, "categories.delete");
    return (count ?? 0) > 0;
  },
};

export const supabaseProductRepository = {
  async list(opts?: { publishedOnly?: boolean }): Promise<Product[]> {
    const sb = createServiceSupabase();
    let q = sb.from("products").select("*").order("created_at", {
      ascending: false,
    });
    if (opts?.publishedOnly !== false) q = q.eq("published", true);
    const { data, error } = await q;
    if (error) throwDb(error, "products.list");
    return (data ?? []).map((row) => mapProduct(row as never));
  },
  async listAll(): Promise<Product[]> {
    const sb = createServiceSupabase();
    const { data, error } = await sb
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throwDb(error, "products.listAll");
    return (data ?? []).map((row) => mapProduct(row as never));
  },
  async getById(id: string) {
    const sb = createServiceSupabase();
    const { data, error } = await sb
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throwDb(error, "products.getById");
    return data ? mapProduct(data as never) : null;
  },
  async getBySlug(slug: string) {
    const sb = createServiceSupabase();
    const { data, error } = await sb
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (error) throwDb(error, "products.getBySlug");
    return data ? mapProduct(data as never) : null;
  },
  async search(query: string): Promise<Product[]> {
    const q = query.trim().toLowerCase();
    const [products, categories] = await Promise.all([
      this.list({ publishedOnly: true }),
      supabaseCategoryRepository.list(false),
    ]);
    if (!q) return products;
    return products.filter((p) => {
      const cat = categories.find((c) => c.id === p.categoryId);
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
    const sb = createServiceSupabase();
    const { data, error } = await sb
      .from("products")
      .insert(toDbProduct(product))
      .select("*")
      .single();
    if (error) throwDb(error, "products.create");
    return mapProduct(data);
  },
  async update(id: string, patch: Partial<Product>): Promise<Product | null> {
    const existing = await this.getById(id);
    if (!existing) return null;
    const next: Product = {
      ...existing,
      ...patch,
      id,
      updatedAt: now(),
    };
    const sb = createServiceSupabase();
    const { data, error } = await sb
      .from("products")
      .update(toDbProduct(next))
      .eq("id", id)
      .select("*")
      .single();
    if (error) throwDb(error, "products.update");
    return mapProduct(data);
  },
  async delete(id: string): Promise<boolean> {
    const sb = createServiceSupabase();
    const { error, count } = await sb
      .from("products")
      .delete({ count: "exact" })
      .eq("id", id);
    if (error) throwDb(error, "products.delete");
    return (count ?? 0) > 0;
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

export const supabaseBannerRepository = {
  async list(activeOnly = false): Promise<Banner[]> {
    const sb = createServiceSupabase();
    const { data, error } = await sb
      .from("banners")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throwDb(error, "banners.list");
    const nowIso = Date.now();
    return (data ?? [])
      .map(mapBanner)
      .filter((b) => {
        if (activeOnly && !b.active) return false;
        if (activeOnly && b.startDate && Date.parse(b.startDate) > nowIso)
          return false;
        if (activeOnly && b.endDate && Date.parse(b.endDate) < nowIso)
          return false;
        return true;
      });
  },
  async getById(id: string) {
    const sb = createServiceSupabase();
    const { data, error } = await sb
      .from("banners")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throwDb(error, "banners.getById");
    return data ? mapBanner(data) : null;
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
    const sb = createServiceSupabase();
    const { data, error } = await sb
      .from("banners")
      .insert(toDbBanner(banner))
      .select("*")
      .single();
    if (error) throwDb(error, "banners.create");
    return mapBanner(data);
  },
  async update(id: string, patch: Partial<Banner>): Promise<Banner | null> {
    const existing = await this.getById(id);
    if (!existing) return null;
    const next: Banner = {
      ...existing,
      ...patch,
      id,
      updatedAt: now(),
    };
    const sb = createServiceSupabase();
    const { data, error } = await sb
      .from("banners")
      .update(toDbBanner(next))
      .eq("id", id)
      .select("*")
      .single();
    if (error) throwDb(error, "banners.update");
    return mapBanner(data);
  },
  async delete(id: string): Promise<boolean> {
    const sb = createServiceSupabase();
    const { error, count } = await sb
      .from("banners")
      .delete({ count: "exact" })
      .eq("id", id);
    if (error) throwDb(error, "banners.delete");
    return (count ?? 0) > 0;
  },
};

const DEFAULT_ANNOUNCEMENT: AnnouncementBar = {
  id: "announcement-main",
  text: "",
  link: null,
  linkTarget: "_self",
  backgroundColor: "#0B6BCB",
  textColor: "#FFFFFF",
  active: false,
  updatedAt: now(),
};

export const supabaseAnnouncementRepository = {
  async get(): Promise<AnnouncementBar> {
    const sb = createServiceSupabase();
    const { data, error } = await sb
      .from("announcement_bar")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (error) throwDb(error, "announcement.get");
    return data ? mapAnnouncement(data) : DEFAULT_ANNOUNCEMENT;
  },
  async update(patch: Partial<AnnouncementBar>): Promise<AnnouncementBar> {
    const current = await this.get();
    const next: AnnouncementBar = {
      ...current,
      ...patch,
      id: current.id,
      updatedAt: now(),
    };
    const sb = createServiceSupabase();
    const { data, error } = await sb
      .from("announcement_bar")
      .upsert(toDbAnnouncement(next))
      .select("*")
      .single();
    if (error) throwDb(error, "announcement.update");
    return mapAnnouncement(data);
  },
};

const DEFAULT_HOMEPAGE: HomepageConfig = {
  featuredCategoryIds: [],
  featuredProductIds: [],
  bestSellerProductIds: [],
  newArrivalProductIds: [],
  saleProductIds: [],
  marketingBannerId: null,
  sections: {
    categories: true,
    bestSellers: true,
    sale: true,
    newArrivals: true,
    featured: true,
    trust: true,
    marketingBanner: true,
    newsletter: true,
  },
  updatedAt: now(),
};

export const supabaseHomepageRepository = {
  async get(): Promise<HomepageConfig> {
    const sb = createServiceSupabase();
    const { data, error } = await sb
      .from("homepage_config")
      .select("*")
      .eq("id", "homepage")
      .maybeSingle();
    if (error) throwDb(error, "homepage.get");
    return data ? mapHomepage(data) : DEFAULT_HOMEPAGE;
  },
  async update(patch: Partial<HomepageConfig>): Promise<HomepageConfig> {
    const current = await this.get();
    const next: HomepageConfig = {
      ...current,
      ...patch,
      sections: { ...current.sections, ...patch.sections },
      updatedAt: now(),
    };
    const sb = createServiceSupabase();
    const { data, error } = await sb
      .from("homepage_config")
      .upsert(toDbHomepage(next))
      .select("*")
      .single();
    if (error) throwDb(error, "homepage.update");
    return mapHomepage(data);
  },
};

export const supabaseOrderRepository = {
  async list(): Promise<Order[]> {
    const sb = createServiceSupabase();
    const { data, error } = await sb
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throwDb(error, "orders.list");
    return (data ?? []).map(mapOrder);
  },
  async getById(id: string) {
    const sb = createServiceSupabase();
    const { data, error } = await sb
      .from("orders")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throwDb(error, "orders.getById");
    return data ? mapOrder(data) : null;
  },
  async getByNumber(orderNumber: string) {
    const sb = createServiceSupabase();
    const { data, error } = await sb
      .from("orders")
      .select("*")
      .eq("order_number", orderNumber)
      .maybeSingle();
    if (error) throwDb(error, "orders.getByNumber");
    return data ? mapOrder(data) : null;
  },
  async track(orderNumber: string, phone: string) {
    const order = await this.getByNumber(orderNumber);
    if (!order) return null;
    const digits = phone.replace(/\D/g, "");
    const orderDigits = order.customer.phone.replace(/\D/g, "");
    if (!orderDigits.endsWith(digits.slice(-10))) return null;
    return order;
  },
  async create(
    input: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt">,
  ): Promise<Order> {
    const sb = createServiceSupabase();
    const { count, error: countError } = await sb
      .from("orders")
      .select("*", { count: "exact", head: true });
    if (countError) throwDb(countError, "orders.count");
    const seq = 10000 + (count ?? 0) + 1;
    const order: Order = {
      ...input,
      id: `ord-${nanoid(10)}`,
      orderNumber: `HE-${seq}`,
      createdAt: now(),
      updatedAt: now(),
    };
    const { data, error } = await sb
      .from("orders")
      .insert(toDbOrder(order))
      .select("*")
      .single();
    if (error) throwDb(error, "orders.create");
    return mapOrder(data);
  },
  async updateStatus(id: string, status: OrderStatus): Promise<Order | null> {
    const existing = await this.getById(id);
    if (!existing) return null;
    const next: Order = { ...existing, status, updatedAt: now() };
    const sb = createServiceSupabase();
    const { data, error } = await sb
      .from("orders")
      .update(toDbOrder(next))
      .eq("id", id)
      .select("*")
      .single();
    if (error) throwDb(error, "orders.updateStatus");
    return mapOrder(data);
  },
};
