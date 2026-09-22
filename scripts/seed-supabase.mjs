/**
 * Seed HANIA catalog into Supabase from data/runtime/store.json
 * Usage: npm run seed:supabase
 *
 * Requires tables from supabase/schema.sql to already exist.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function loadEnvLocal() {
  const raw = readFileSync(path.join(root, ".env.local"), "utf8");
  for (const line of raw.split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;
    const i = line.indexOf("=");
    if (i === -1) continue;
    const key = line.slice(0, i);
    const value = line.slice(i + 1);
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const sb = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const store = JSON.parse(
  readFileSync(path.join(root, "data", "runtime", "store.json"), "utf8"),
);

async function main() {
  console.log("Seeding categories…");
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
    const { error } = await sb.from("categories").upsert(rows);
    if (error) throw error;
    console.log(`  ${rows.length} categories`);
  }

  console.log("Seeding products…");
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
    const { error } = await sb.from("products").upsert(rows);
    if (error) throw error;
    console.log(`  ${rows.length} products`);
  }

  console.log("Seeding banners…");
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
    const { error } = await sb.from("banners").upsert(rows);
    if (error) throw error;
    console.log(`  ${rows.length} banners`);
  }

  console.log("Seeding announcement…");
  {
    const a = store.announcement;
    const { error } = await sb.from("announcement_bar").upsert({
      id: a.id,
      text: a.text,
      link: a.link,
      link_target: a.linkTarget,
      background_color: a.backgroundColor,
      text_color: a.textColor,
      active: a.active,
      updated_at: a.updatedAt,
    });
    if (error) throw error;
  }

  console.log("Seeding homepage…");
  {
    const h = store.homepage;
    const { error } = await sb.from("homepage_config").upsert({
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
    if (error) throw error;
  }

  console.log("Seeding orders…");
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
      const { error } = await sb.from("orders").upsert(rows);
      if (error) throw error;
    }
    console.log(`  ${rows.length} orders`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
