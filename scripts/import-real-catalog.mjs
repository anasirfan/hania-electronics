/**
 * Replace demo catalog with real products:
 * 1. Clear all products + categories in Supabase
 * 2. Upload category splash + product images to Storage
 * 3. Insert 4 categories + real products
 * 4. Rewrite data/runtime/store.json + homepage featured IDs
 *
 * Usage: node scripts/import-real-catalog.mjs
 */
import { createClient } from "@supabase/supabase-js";
import {
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
  existsSync,
  mkdirSync,
} from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

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

const BUCKET = "uploads";
const now = new Date().toISOString();
const IMAGE_EXT = /\.(webp|avif|jpe?g|png|gif)$/i;

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return (
    {
      ".webp": "image/webp",
      ".avif": "image/avif",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
    }[ext] || "application/octet-stream"
  );
}

function publicUrl(storageKey) {
  return `${url.replace(/\/$/, "")}/storage/v1/object/public/${BUCKET}/${storageKey.replace(/^\/+/, "")}`;
}

function slugify(input) {
  return String(input)
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

function listImages(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => IMAGE_EXT.test(name))
    .filter((name) => !/^chatgpt/i.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((name) => path.join(dir, name));
}

function readTxt(dir) {
  if (!existsSync(dir)) return "";
  const txt = readdirSync(dir).find((n) => n.toLowerCase().endsWith(".txt"));
  if (!txt) return "";
  return readFileSync(path.join(dir, txt), "utf8");
}

function parseVocoTxt(raw) {
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const title = lines[0] || "";
  const priceLine = lines.find((l) => /^price\s+/i.test(l));
  const price = priceLine
    ? Number(String(priceLine).replace(/[^\d.]/g, ""))
    : 0;
  const body = lines
    .filter((l) => l !== title && !/^price\s+/i.test(l))
    .join(" ")
    .trim();
  const skuMatch = title.match(/\(([^)]+)\)/);
  return {
    name: title.replace(/\s*[–—-]\s*VOCO Pakistan$/i, "").trim() || title,
    sku: skuMatch ? skuMatch[1].trim() : "",
    price,
    description: body || title,
  };
}

async function ensureBucket() {
  const { data: buckets } = await sb.storage.listBuckets();
  const exists = (buckets || []).some((b) => b.id === BUCKET);
  if (!exists) {
    const { error } = await sb.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: 50 * 1024 * 1024,
    });
    if (error) throw error;
  }
}

async function uploadFile(localPath, storageKey) {
  const body = readFileSync(localPath);
  const { error } = await sb.storage.from(BUCKET).upload(storageKey, body, {
    contentType: contentType(localPath),
    upsert: true,
    cacheControl: "31536000",
  });
  if (error) throw new Error(`${storageKey}: ${error.message}`);
  return publicUrl(storageKey);
}

async function clearCatalog() {
  console.log("Clearing demo products…");
  {
    const { error } = await sb.from("products").delete().neq("id", "");
    if (error) throw error;
  }
  console.log("Clearing old categories…");
  {
    const { error } = await sb.from("categories").delete().neq("id", "");
    if (error) throw error;
  }
}

const CATEGORIES = [
  {
    id: "cat-light-your-night",
    name: "Light Your Night",
    slug: "light-your-night",
    description: "Rechargeable bulbs and backup lighting for every blackout.",
    splashLocal: path.join(
      root,
      "public/media/categories/new/light-your-night.jpg",
    ),
    splashKey: "media/categories/light-your-night.jpg",
    sortOrder: 1,
  },
  {
    id: "cat-voco-premium",
    name: "VOCO Premium Accessories",
    slug: "voco-premium-accessories",
    description: "Cables, chargers, earbuds and smartwatches by VOCO.",
    splashLocal: path.join(
      root,
      "public/media/categories/new/voco-accessories.jpg",
    ),
    splashKey: "media/categories/voco-premium-accessories.jpg",
    sortOrder: 2,
  },
  {
    id: "cat-style-care",
    name: "Style & Care",
    slug: "style-care",
    description: "Personal care and style essentials for everyday confidence.",
    splashLocal: path.join(root, "public/media/categories/new/style-care.jpg"),
    splashKey: "media/categories/style-care.jpg",
    sortOrder: 3,
  },
  {
    id: "cat-smart-living",
    name: "Smart Living",
    slug: "smart-living",
    description: "Smart home gadgets that make daily life easier.",
    splashLocal: path.join(
      root,
      "public/media/categories/new/smart-living.jpg",
    ),
    splashKey: "media/categories/smart-living.jpg",
    sortOrder: 4,
  },
];

const VOCO_META = [
  {
    folder: "V-Link Durable (L-01ac)",
    id: "p-voco-l01ac",
    features: ["Braided nylon", "Aluminum alloy tips", "Type-A to Type-C", "Daily durable"],
    tags: ["voco", "cable", "charging"],
  },
  {
    folder: "V-Link Fast (L-01cc)",
    id: "p-voco-l01cc",
    features: ["60W fast charge", "Type-C to Type-C", "Braided nylon", "Data sync"],
    tags: ["voco", "cable", "fast-charge"],
  },
  {
    folder: "V-Power Basic 12 (P-01)",
    id: "p-voco-p01",
    features: ["12W charging", "LED indicator", "Type A-C cable included", "Compact"],
    tags: ["voco", "charger"],
  },
  {
    folder: "V-Power Go 20 (P-02)",
    id: "p-voco-p02",
    features: ["20W GaN", "Dual ports A+C", "Fire-resistant", "Travel ready"],
    tags: ["voco", "charger", "gan"],
  },
  {
    folder: "V-Power Flow 30 (P-03)",
    id: "p-voco-p03",
    features: ["30W GaN PD 3.0", "USB-A + USB-C", "Smart distribution", "Compact"],
    tags: ["voco", "charger", "gan"],
  },
  {
    folder: "V-Sound Bass (S-01)",
    id: "p-voco-s01",
    features: ["13mm drivers", "Deep bass", "TWS", "Everyday comfort"],
    tags: ["voco", "earbuds", "audio"],
  },
  {
    folder: "V-Sound Aura (S-02)",
    id: "p-voco-s02",
    features: ["ANC + ENC", "Quad mic", "66ms latency", "Bluetooth 6.0"],
    tags: ["voco", "earbuds", "anc"],
  },
  {
    folder: "V-Sound Glow (S-03)",
    id: "p-voco-s03",
    features: ["ANC + ENC", "45ms latency", "LED case", "Bluetooth 6.0"],
    tags: ["voco", "earbuds", "anc"],
  },
  {
    folder: "V-Watch Go (W-01)",
    id: "p-voco-w01",
    features: ["1.43″ AMOLED", "IP68", "24h health", "Long battery"],
    tags: ["voco", "smartwatch"],
  },
  {
    folder: "V-Watch Life (W-02)",
    id: "p-voco-w02",
    features: ["1.95″ AMOLED", "Always-On Display", "Rich contrast", "Premium look"],
    tags: ["voco", "smartwatch"],
  },
  {
    folder: "V-Watch Elite (W-03)",
    id: "p-voco-w03",
    features: ["1.43″ AMOLED", "Always-On Display", "Sharp detail", "Modern design"],
    tags: ["voco", "smartwatch"],
  },
];

function findVocoDir(vocoRoot, folderPrefix) {
  const dirs = readdirSync(vocoRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
  const hit = dirs.find((d) => d.startsWith(folderPrefix) || d.includes(folderPrefix));
  if (!hit) throw new Error(`VOCO folder not found for: ${folderPrefix}`);
  return path.join(vocoRoot, hit);
}

function buildProductImages(urls, productName) {
  return urls.map((u, i) => ({
    id: randomUUID(),
    url: u,
    alt: productName,
    sortOrder: i,
    isPrimary: i === 0,
  }));
}

function buildProduct(input) {
  return {
    id: input.id,
    name: input.name,
    slug: input.slug,
    sku: input.sku,
    categoryId: input.categoryId,
    subcategory: input.subcategory ?? null,
    shortDescription: input.shortDescription,
    description: input.description,
    price: input.price,
    salePrice: input.salePrice ?? null,
    compareAtPrice: input.compareAtPrice ?? null,
    stockQuantity: input.stockQuantity ?? 50,
    stockStatus: "in_stock",
    featured: input.featured ?? false,
    bestSeller: input.bestSeller ?? false,
    newArrival: input.newArrival ?? true,
    saleBadge: Boolean(input.salePrice),
    manualBadges: input.manualBadges ?? [],
    images: input.images,
    specifications: input.specifications ?? {
      Brand: input.brand || "HANIA",
      Warranty: "6 months",
    },
    features: input.features,
    tags: input.tags,
    seoTitle: `${input.name} | HANIA Electronics`,
    seoDescription: input.shortDescription,
    published: true,
    createdAt: now,
    updatedAt: now,
  };
}

async function main() {
  await ensureBucket();
  await clearCatalog();

  console.log("Uploading category splash images…");
  const categoryRows = [];
  for (const c of CATEGORIES) {
    if (!existsSync(c.splashLocal)) {
      throw new Error(`Missing splash: ${c.splashLocal}`);
    }
    const image = await uploadFile(c.splashLocal, c.splashKey);
    categoryRows.push({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      image,
      featured: true,
      sortOrder: c.sortOrder,
      active: true,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`  ${c.name}`);
  }

  {
    const rows = categoryRows.map((c) => ({
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
    console.log(`Inserted ${rows.length} categories`);
  }

  const products = [];

  // ── Light Your Night: 20W charging bulb ──────────────────────────
  console.log("Uploading Light Your Night products…");
  const bulbDir = path.join(
    root,
    "public/products/20 watt Charging bulb with 2 big battries price 999",
  );
  const bulbLocals = listImages(bulbDir);
  if (!bulbLocals.length) throw new Error("No bulb images found");
  const bulbUrls = [];
  for (let i = 0; i < bulbLocals.length; i++) {
    const ext = path.extname(bulbLocals[i]).toLowerCase();
    const key = `products/light-your-night/20w-charging-bulb/${String(i + 1).padStart(2, "0")}${ext}`;
    bulbUrls.push(await uploadFile(bulbLocals[i], key));
  }
  products.push(
    buildProduct({
      id: "p-bulb-20w",
      name: "20W Charging Bulb with 2 Big Batteries",
      slug: "20w-charging-bulb-2-big-batteries",
      sku: "HE-LYN-20W",
      categoryId: "cat-light-your-night",
      brand: "HANIA",
      shortDescription:
        "20W rechargeable emergency bulb with dual high-capacity batteries — Rs 999.",
      description:
        "Stay lit during load-shedding with this 20W rechargeable charging bulb. Dual big batteries deliver long backup runtime for homes, shops, and rooms. Screw-in convenience with bright white light when the grid is down.",
      price: 999,
      featured: true,
      bestSeller: true,
      newArrival: true,
      images: buildProductImages(bulbUrls, "20W Charging Bulb"),
      features: [
        "20W bright output",
        "2 big batteries",
        "Rechargeable backup",
        "Load-shedding ready",
      ],
      tags: ["bulb", "rechargeable", "emergency", "light-your-night"],
      specifications: {
        Wattage: "20W",
        Batteries: "2 big batteries",
        Type: "Rechargeable charging bulb",
        Warranty: "6 months",
        Brand: "HANIA",
      },
    }),
  );
  console.log(`  20W Charging Bulb (${bulbUrls.length} images)`);

  // ── VOCO products ────────────────────────────────────────────────
  console.log("Uploading VOCO products…");
  const vocoRoot = path.join(root, "public/products/VOCO Premium Accessories");
  for (const meta of VOCO_META) {
    const dir = findVocoDir(vocoRoot, meta.folder);
    const parsed = parseVocoTxt(readTxt(dir));
    const locals = listImages(dir);
    if (!locals.length) throw new Error(`No images in ${dir}`);
    if (!parsed.price) throw new Error(`Missing price for ${meta.folder}`);

    const slugBase = slugify(parsed.name || meta.folder);
    const urls = [];
    for (let i = 0; i < locals.length; i++) {
      const ext = path.extname(locals[i]).toLowerCase();
      const key = `products/voco/${slugBase}/${String(i + 1).padStart(2, "0")}${ext}`;
      urls.push(await uploadFile(locals[i], key));
    }

    const name = parsed.name || meta.folder;
    const sku = parsed.sku
      ? `VOCO-${parsed.sku.replace(/\s+/g, "").toUpperCase()}`
      : `VOCO-${meta.id.replace("p-voco-", "").toUpperCase()}`;

    products.push(
      buildProduct({
        id: meta.id,
        name,
        slug: slugBase,
        sku,
        categoryId: "cat-voco-premium",
        brand: "VOCO",
        shortDescription: parsed.description.slice(0, 140),
        description: parsed.description,
        price: parsed.price,
        featured: meta.tags.includes("smartwatch") || meta.tags.includes("anc"),
        bestSeller: ["p-voco-p02", "p-voco-s02", "p-voco-w01"].includes(meta.id),
        newArrival: true,
        images: buildProductImages(urls, name),
        features: meta.features,
        tags: meta.tags,
        specifications: {
          Brand: "VOCO",
          Model: parsed.sku || name,
          Warranty: "6 months",
        },
      }),
    );
    console.log(`  ${name} — Rs ${parsed.price} (${urls.length} images)`);
  }

  {
    const rows = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      category_id: p.categoryId,
      subcategory: p.subcategory,
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
    console.log(`Inserted ${rows.length} products`);
  }

  const featuredIds = products.filter((p) => p.featured).map((p) => p.id);
  const bestSellerIds = products.filter((p) => p.bestSeller).map((p) => p.id);
  const newArrivalIds = products.map((p) => p.id);

  console.log("Updating homepage config…");
  {
    const homepage = {
      id: "homepage",
      featured_category_ids: categoryRows.map((c) => c.id),
      featured_product_ids: featuredIds.slice(0, 8),
      best_seller_product_ids: bestSellerIds.length
        ? bestSellerIds
        : products.slice(0, 6).map((p) => p.id),
      new_arrival_product_ids: newArrivalIds,
      sale_product_ids: [],
      marketing_banner_id: "banner-3",
      sections: {
        categories: true,
        bestSellers: true,
        sale: false,
        newArrivals: true,
        featured: true,
        trust: true,
        marketingBanner: true,
        newsletter: true,
      },
      updated_at: now,
    };
    const { error } = await sb.from("homepage_config").upsert(homepage);
    if (error) throw error;
  }

  // Persist runtime store for local fallback
  const storePath = path.join(root, "data/runtime/store.json");
  mkdirSync(path.dirname(storePath), { recursive: true });
  let store = {
    categories: categoryRows,
    products,
    banners: [],
    announcement: {
      id: "announce-1",
      text: "NEW ARRIVALS — LIGHT YOUR NIGHT & VOCO PREMIUM",
      link: "/shop",
      linkTarget: "_self",
      backgroundColor: "#0B6BCB",
      textColor: "#FFFFFF",
      active: true,
      updatedAt: now,
    },
    homepage: {
      featuredCategoryIds: categoryRows.map((c) => c.id),
      featuredProductIds: featuredIds.slice(0, 8),
      bestSellerProductIds: bestSellerIds.length
        ? bestSellerIds
        : products.slice(0, 6).map((p) => p.id),
      newArrivalProductIds: newArrivalIds,
      saleProductIds: [],
      marketingBannerId: "banner-3",
      sections: {
        categories: true,
        bestSellers: true,
        sale: false,
        newArrivals: true,
        featured: true,
        trust: true,
        marketingBanner: true,
        newsletter: true,
      },
      updatedAt: now,
    },
    orders: [],
  };

  // Keep existing banners/announcement if present
  if (existsSync(storePath)) {
    try {
      const prev = JSON.parse(readFileSync(storePath, "utf8"));
      if (Array.isArray(prev.banners) && prev.banners.length) {
        store.banners = prev.banners;
      }
      if (prev.announcement) {
        store.announcement = {
          ...prev.announcement,
          text: "NEW ARRIVALS — LIGHT YOUR NIGHT & VOCO PREMIUM",
          link: "/shop",
          updatedAt: now,
        };
      }
      if (Array.isArray(prev.orders)) store.orders = prev.orders;
    } catch {
      /* ignore */
    }
  }

  writeFileSync(storePath, JSON.stringify(store, null, 2), "utf8");
  console.log("Wrote data/runtime/store.json");

  // Manifest for seed file generation
  const manifestPath = path.join(root, "scripts/.catalog-manifest.json");
  writeFileSync(
    manifestPath,
    JSON.stringify(
      {
        categories: categoryRows,
        products: products.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          sku: p.sku,
          categoryId: p.categoryId,
          shortDescription: p.shortDescription,
          description: p.description,
          price: p.price,
          featured: p.featured,
          bestSeller: p.bestSeller,
          newArrival: p.newArrival,
          images: p.images,
          features: p.features,
          tags: p.tags,
          specifications: p.specifications,
        })),
      },
      null,
      2,
    ),
    "utf8",
  );

  console.log("Done.");
  console.log(`Categories: ${categoryRows.length}, Products: ${products.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
