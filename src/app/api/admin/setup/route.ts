import { readFileSync } from "fs";
import path from "path";
import { requireAdmin } from "@/server/api/require-admin";
import { jsonOk, jsonError, parseJson } from "@/server/api/http";
import {
  createServiceSupabase,
  isSupabaseConfigured,
} from "@/server/supabase/client";
import { getDataBackend } from "@/server/repositories";

async function tablesReady(): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase env not configured" };
  }
  const sb = createServiceSupabase();
  const { error } = await sb.from("categories").select("id").limit(1);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const ready = await tablesReady();
  let schemaSql = "";
  try {
    schemaSql = readFileSync(
      path.join(process.cwd(), "supabase", "schema.sql"),
      "utf8",
    );
  } catch {
    schemaSql = "";
  }

  return jsonOk({
    backend: getDataBackend(),
    tablesReady: ready.ok,
    tablesError: ready.error ?? null,
    schemaSql,
    projectUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? null,
  });
}

export async function POST(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  if (!isSupabaseConfigured()) {
    return jsonError("Supabase is not configured", 400);
  }

  const body = await parseJson<{ action?: string }>(req);
  if (body.action !== "seed") {
    return jsonError("Unknown action", 400);
  }

  const ready = await tablesReady();
  if (!ready.ok) {
    return jsonError(
      `Tables missing. Run supabase/schema.sql in the SQL Editor first. (${ready.error})`,
      400,
    );
  }

  const store = JSON.parse(
    readFileSync(
      path.join(process.cwd(), "data", "runtime", "store.json"),
      "utf8",
    ),
  ) as {
    categories: Array<Record<string, unknown>>;
    products: Array<Record<string, unknown>>;
    banners: Array<Record<string, unknown>>;
    announcement: Record<string, unknown>;
    homepage: Record<string, unknown>;
    orders: Array<Record<string, unknown>>;
  };

  const sb = createServiceSupabase();
  const logs: string[] = [];

  {
    const rows = store.categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      image: c.image,
      featured: c.featured,
      sort_order: c.sortOrder,
      active: c.active,
      created_at: c.createdAt,
      updated_at: c.updatedAt,
    }));
    const { error: e } = await sb.from("categories").upsert(rows);
    if (e) return jsonError(`categories: ${e.message}`, 500);
    logs.push(`${rows.length} categories`);
  }

  {
    const rows = store.products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      category_id: p.categoryId,
      subcategory: p.subcategory ?? null,
      short_description: p.shortDescription,
      description: p.description,
      price: p.price,
      sale_price: p.salePrice,
      compare_at_price: p.compareAtPrice,
      stock_quantity: p.stockQuantity,
      stock_status: p.stockStatus,
      featured: p.featured,
      best_seller: p.bestSeller,
      new_arrival: p.newArrival,
      sale_badge: p.saleBadge,
      manual_badges: p.manualBadges,
      images: p.images,
      specifications: p.specifications,
      features: p.features,
      tags: p.tags,
      seo_title: p.seoTitle,
      seo_description: p.seoDescription,
      published: p.published,
      created_at: p.createdAt,
      updated_at: p.updatedAt,
    }));
    const { error: e } = await sb.from("products").upsert(rows);
    if (e) return jsonError(`products: ${e.message}`, 500);
    logs.push(`${rows.length} products`);
  }

  {
    const rows = store.banners.map((b) => ({
      id: b.id,
      title: b.title,
      subtitle: b.subtitle,
      cta_text: b.ctaText,
      cta_link: b.ctaLink,
      desktop_image: b.desktopImage,
      mobile_image: b.mobileImage,
      active: b.active,
      sort_order: b.sortOrder,
      start_date: b.startDate,
      end_date: b.endDate,
      created_at: b.createdAt,
      updated_at: b.updatedAt,
    }));
    const { error: e } = await sb.from("banners").upsert(rows);
    if (e) return jsonError(`banners: ${e.message}`, 500);
    logs.push(`${rows.length} banners`);
  }

  {
    const a = store.announcement;
    const { error: e } = await sb.from("announcement_bar").upsert({
      id: a.id,
      text: a.text,
      link: a.link,
      link_target: a.linkTarget,
      background_color: a.backgroundColor,
      text_color: a.textColor,
      active: a.active,
      updated_at: a.updatedAt,
    });
    if (e) return jsonError(`announcement: ${e.message}`, 500);
    logs.push("announcement");
  }

  {
    const h = store.homepage;
    const { error: e } = await sb.from("homepage_config").upsert({
      id: "homepage",
      featured_category_ids: h.featuredCategoryIds,
      featured_product_ids: h.featuredProductIds,
      best_seller_product_ids: h.bestSellerProductIds,
      new_arrival_product_ids: h.newArrivalProductIds,
      sale_product_ids: h.saleProductIds,
      marketing_banner_id: h.marketingBannerId,
      sections: h.sections,
      updated_at: h.updatedAt,
    });
    if (e) return jsonError(`homepage: ${e.message}`, 500);
    logs.push("homepage");
  }

  {
    const rows = store.orders.map((o) => ({
      id: o.id,
      order_number: o.orderNumber,
      customer: o.customer,
      items: o.items,
      subtotal: o.subtotal,
      discount: o.discount,
      shipping: o.shipping,
      total: o.total,
      payment_method: o.paymentMethod,
      status: o.status,
      created_at: o.createdAt,
      updated_at: o.updatedAt,
    }));
    if (rows.length) {
      const { error: e } = await sb.from("orders").upsert(rows);
      if (e) return jsonError(`orders: ${e.message}`, 500);
    }
    logs.push(`${rows.length} orders`);
  }

  return jsonOk({ seeded: true, logs });
}
