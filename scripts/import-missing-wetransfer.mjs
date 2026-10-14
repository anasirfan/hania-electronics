/**
 * Cross-check WeTransfer drop vs live Supabase catalog
 * and insert only missing products (images → Storage, rows → products).
 *
 * Does NOT delete existing products.
 * Usage: node scripts/import-missing-wetransfer.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID, createHash } from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const SOURCE =
  "C:\\Users\\Administrator\\Downloads\\wetransfer-full-extract";

function loadEnvLocal() {
  const raw = readFileSync(path.join(root, ".env.local"), "utf8");
  for (const line of raw.split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;
    const i = line.indexOf("=");
    if (i === -1) continue;
    if (!process.env[line.slice(0, i)]) process.env[line.slice(0, i)] = line.slice(i + 1);
  }
}
loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing Supabase env");
  process.exit(1);
}

const sb = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const BUCKET = "uploads";
const IMAGE_EXT = /\.(webp|avif|jpe?g|png|gif)$/i;
const now = new Date().toISOString();

const CAT_MAP = [
  { folder: "Light Your Night", id: "cat-light-your-night", prefix: "lyn" },
  { folder: "VOCO Premium Accessories", id: "cat-voco-premium", prefix: "voco" },
  { folder: "style And care", id: "cat-style-care", prefix: "sc" },
  { folder: "smart living", id: "cat-smart-living", prefix: "sl" },
];

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
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70);
}

function parsePrice(...texts) {
  const blob = texts.filter(Boolean).join("\n");
  const nums = [];
  const re = /pri[cv]e\s*[:.\-]*\s*(\d{3,6})/gi;
  let m;
  while ((m = re.exec(blob))) nums.push(Number(m[1]));
  const rs = blob.match(/Rs\.?\s*(\d{3,6})/i);
  if (rs) nums.push(Number(rs[1]));
  if (!nums.length) return 0;
  return Math.max(...nums);
}

function cleanName(folder, txt) {
  const firstLine = String(txt || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .find(Boolean);
  let s = firstLine && firstLine.length > 8 ? firstLine : folder;
  s = s.replace(/\s*[–—-]\s*VOCO Pakistan$/i, "");
  s = s.replace(/\s*pri[cv]e\s*[:.\-]*\s*\d+.*$/i, "");
  s = s.replace(/\s*6\s*months?\s*warrenty.*$/i, "");
  s = s.replace(/[_]+/g, " ");
  s = s.replace(/\s+/g, " ").trim();
  return s || folder;
}

function readTxt(dir) {
  if (!existsSync(dir)) return "";
  const txt = readdirSync(dir).find((n) => n.toLowerCase().endsWith(".txt"));
  if (!txt) return "";
  return readFileSync(path.join(dir, txt), "utf8");
}

function listImages(dir) {
  if (!existsSync(dir)) return [];
  const files = readdirSync(dir)
    .filter((name) => IMAGE_EXT.test(name))
    .map((name) => path.join(dir, name));
  const productShots = files.filter(
    (f) => !/^chatgpt/i.test(path.basename(f)),
  );
  return productShots.length ? productShots : files;
}

function norm(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function alreadyExists(product, existing) {
  const n = norm(product.name);
  const slug = product.slug;
  const sku = norm(product.sku);
  return existing.some((p) => {
    if (p.slug === slug) return true;
    if (sku && norm(p.sku) === sku) return true;
    const pn = norm(p.name);
    if (pn && n && (pn === n || pn.includes(n) || n.includes(pn))) return true;
    // VOCO model codes
    const code = product.name.match(/\(([A-Z0-9-]+)\)/i);
    if (code && String(p.name).toUpperCase().includes(code[1].toUpperCase())) {
      return true;
    }
    return false;
  });
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

function skuFrom(prefix, slug, price) {
  const hash = createHash("sha1")
    .update(`${prefix}-${slug}-${price}`)
    .digest("hex")
    .slice(0, 6)
    .toUpperCase();
  const stub = slug.replace(/-/g, "").slice(0, 10).toUpperCase();
  return `HE-${prefix.toUpperCase()}-${stub || hash}-${hash}`;
}

async function main() {
  const { data: existing, error: e1 } = await sb
    .from("products")
    .select("id,name,slug,sku,price,category_id");
  if (e1) throw e1;
  const live = existing || [];

  const report = {
    generatedAt: now,
    source: SOURCE,
    alreadyLive: [],
    inserted: [],
    skippedEmpty: [],
    skippedNoPrice: [],
    failed: [],
  };

  const toInsert = [];

  for (const cat of CAT_MAP) {
    const catDir = path.join(SOURCE, cat.folder);
    if (!existsSync(catDir)) {
      report.failed.push({ folder: cat.folder, reason: "category folder missing" });
      continue;
    }
    const productDirs = readdirSync(catDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    for (const folder of productDirs) {
      const dir = path.join(catDir, folder);
      const txt = readTxt(dir);
      const images = listImages(dir);
      const imageNames = images.map((f) => path.basename(f)).join("\n");
      const price = parsePrice(folder, txt, imageNames);
      const name = cleanName(
        folder.length > 8 ? folder : imageNames.split("\n")[0] || folder,
        txt,
      );
      const slug = slugify(name) || slugify(folder);
      const sku = skuFrom(cat.prefix, slug, price);
      const candidate = { name, slug, sku, price, folder, catId: cat.id };

      if (!images.length) {
        report.skippedEmpty.push({
          category: cat.folder,
          folder,
          name,
          reason: "no images in folder",
        });
        continue;
      }
      if (!price) {
        report.skippedNoPrice.push({
          category: cat.folder,
          folder,
          name,
          images: images.length,
          reason: "could not parse PKR price",
        });
        continue;
      }
      if (alreadyExists(candidate, live) || alreadyExists(candidate, toInsert)) {
        report.alreadyLive.push({
          category: cat.folder,
          name,
          price,
          match: "existing Supabase product",
        });
        continue;
      }

      toInsert.push({
        ...candidate,
        dir,
        txt,
        images,
        prefix: cat.prefix,
        categoryFolder: cat.folder,
      });
    }
  }

  console.log(
    `Queue ${toInsert.length} new products. Skip empty=${report.skippedEmpty.length} no-price=${report.skippedNoPrice.length} already=${report.alreadyLive.length}`,
  );

  for (const item of toInsert) {
    try {
      const urls = [];
      for (let i = 0; i < item.images.length; i++) {
        const ext = path.extname(item.images[i]).toLowerCase() || ".jpg";
        const key = `products/${item.prefix}/${item.slug}/${String(i + 1).padStart(2, "0")}${ext}`;
        urls.push(await uploadFile(item.images[i], key));
      }
      const short = (item.txt || item.name)
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l && !/^price/i.test(l))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      const description = short || item.name;
      const id = `p-${item.prefix}-${createHash("sha1").update(item.slug).digest("hex").slice(0, 10)}`;
      const row = {
        id,
        name: item.name,
        slug: item.slug,
        sku: item.sku,
        category_id: item.catId,
        subcategory: null,
        short_description: description.slice(0, 180),
        description,
        price: item.price,
        sale_price: null,
        compare_at_price: null,
        stock_quantity: 50,
        stock_status: "in_stock",
        featured: false,
        best_seller: false,
        new_arrival: true,
        sale_badge: false,
        manual_badges: [],
        images: urls.map((u, i) => ({
          id: randomUUID(),
          url: u,
          alt: item.name,
          sortOrder: i,
          isPrimary: i === 0,
        })),
        specifications: {
          Warranty: "6 months",
          Origin: "Imported",
        },
        features: [],
        tags: [item.prefix],
        seo_title: `${item.name} | HANIA Electronics`,
        seo_description: description.slice(0, 160),
        published: true,
        created_at: now,
        updated_at: now,
      };
      const { error } = await sb.from("products").upsert(row);
      if (error) throw error;
      report.inserted.push({
        id,
        category: item.categoryFolder,
        name: item.name,
        slug: item.slug,
        sku: item.sku,
        price: item.price,
        images: urls.length,
      });
      console.log(`  + ${item.name} — Rs ${item.price} (${urls.length} imgs)`);
    } catch (err) {
      report.failed.push({
        folder: item.folder,
        name: item.name,
        reason: err.message,
      });
      console.error(`  FAIL ${item.folder}:`, err.message);
    }
  }

  const { data: allProds } = await sb
    .from("products")
    .select("id,name,price,category_id,published")
    .eq("published", true);
  const byCat = {};
  for (const p of allProds || []) {
    byCat[p.category_id] = (byCat[p.category_id] || 0) + 1;
  }

  const newIds = (allProds || [])
    .filter((p) => p.category_id)
    .map((p) => p.id);

  const { data: homepage } = await sb
    .from("homepage_config")
    .select("*")
    .eq("id", "homepage")
    .maybeSingle();
  if (homepage) {
    const insertedIds = report.inserted.map((p) => p.id);
    await sb.from("homepage_config").update({
      new_arrival_product_ids: [
        ...insertedIds,
        ...(homepage.new_arrival_product_ids || []),
      ].slice(0, 16),
      updated_at: now,
    }).eq("id", "homepage");
  }

  report.liveTotals = {
    products: (allProds || []).length,
    byCategory: byCat,
  };

  const reportPath = path.join(root, "scripts", "wetransfer-import-report.json");
  writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8");
  console.log("\nReport:", reportPath);
  console.log(JSON.stringify(report.liveTotals, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
