/**
 * Upload all public image/video assets to Supabase Storage (uploads bucket)
 * and rewrite DB + store.json URLs to public Storage URLs.
 *
 * Usage: npm run media:migrate
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
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
  console.error("Missing Supabase env");
  process.exit(1);
}

const sb = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const BUCKET = "uploads";
const EXT =
  /\.(webp|avif|jpe?g|png|gif|svg|mp4|webm|mov|m4v|ogg)$/i;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (EXT.test(name)) out.push(full);
  }
  return out;
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    ".webp": "image/webp",
    ".avif": "image/avif",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".mov": "video/quicktime",
    ".m4v": "video/x-m4v",
    ".ogg": "video/ogg",
  };
  return map[ext] || "application/octet-stream";
}

function toPublicUrl(assetPath) {
  if (!assetPath || typeof assetPath !== "string") return assetPath;
  if (/supabase\.co\/storage/i.test(assetPath)) return assetPath;
  if (/^https?:\/\//i.test(assetPath)) return assetPath;
  const key = assetPath.replace(/^\/+/, "");
  return `${url.replace(/\/$/, "")}/storage/v1/object/public/${BUCKET}/${key}`;
}

function rewriteDeep(value) {
  if (typeof value === "string") {
    if (
      value.startsWith("/media/") ||
      value.startsWith("/scenes/") ||
      value.startsWith("/products/") ||
      value.startsWith("/products-clean/") ||
      value.startsWith("/categories/") ||
      value.startsWith("/brand/") ||
      value.startsWith("/hero/")
    ) {
      return toPublicUrl(value);
    }
    return value;
  }
  if (Array.isArray(value)) return value.map(rewriteDeep);
  if (value && typeof value === "object") {
    const next = {};
    for (const [k, v] of Object.entries(value)) next[k] = rewriteDeep(v);
    return next;
  }
  return value;
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
    console.log("Created bucket", BUCKET);
  } else {
    await sb.storage.updateBucket(BUCKET, { public: true });
  }
}

async function uploadAll() {
  const publicDir = path.join(root, "public");
  const files = walk(publicDir).filter((f) => {
    const rel = path.relative(publicDir, f).replace(/\\/g, "/");
    // skip next/vercel placeholder svgs at root if desired — still upload brand assets
    return !["file.svg", "globe.svg", "next.svg", "vercel.svg", "window.svg"].includes(
      path.basename(f),
    ) || rel.includes("/");
  });

  console.log(`Uploading ${files.length} files to ${BUCKET}/…`);
  let ok = 0;
  let fail = 0;

  for (const full of files) {
    const rel = path.relative(publicDir, full).replace(/\\/g, "/");
    const body = readFileSync(full);
    const { error } = await sb.storage.from(BUCKET).upload(rel, body, {
      contentType: contentType(full),
      upsert: true,
      cacheControl: "31536000",
    });
    if (error) {
      console.error(" FAIL", rel, error.message);
      fail++;
    } else {
      ok++;
      if (ok % 20 === 0) console.log(`  ${ok}/${files.length}`);
    }
  }
  console.log(`Upload done: ${ok} ok, ${fail} failed`);
  return { ok, fail };
}

async function rewriteDatabase() {
  console.log("Rewriting database URLs…");

  // categories
  {
    const { data, error } = await sb.from("categories").select("*");
    if (error) throw error;
    for (const row of data || []) {
      const image = toPublicUrl(row.image);
      if (image !== row.image) {
        const { error: e } = await sb
          .from("categories")
          .update({ image })
          .eq("id", row.id);
        if (e) throw e;
      }
    }
    console.log(`  categories: ${(data || []).length}`);
  }

  // products
  {
    const { data, error } = await sb.from("products").select("*");
    if (error) throw error;
    for (const row of data || []) {
      const images = rewriteDeep(row.images);
      const { error: e } = await sb
        .from("products")
        .update({ images })
        .eq("id", row.id);
      if (e) throw e;
    }
    console.log(`  products: ${(data || []).length}`);
  }

  // banners
  {
    const { data, error } = await sb.from("banners").select("*");
    if (error) throw error;
    for (const row of data || []) {
      const { error: e } = await sb
        .from("banners")
        .update({
          desktop_image: toPublicUrl(row.desktop_image),
          mobile_image: toPublicUrl(row.mobile_image),
        })
        .eq("id", row.id);
      if (e) throw e;
    }
    console.log(`  banners: ${(data || []).length}`);
  }

  // orders (item images)
  {
    const { data, error } = await sb.from("orders").select("*");
    if (error) throw error;
    for (const row of data || []) {
      const items = rewriteDeep(row.items);
      const { error: e } = await sb
        .from("orders")
        .update({ items })
        .eq("id", row.id);
      if (e) throw e;
    }
    console.log(`  orders: ${(data || []).length}`);
  }
}

function rewriteStoreJson() {
  const storePath = path.join(root, "data", "runtime", "store.json");
  try {
    const store = JSON.parse(readFileSync(storePath, "utf8"));
    const next = rewriteDeep(store);
    writeFileSync(storePath, JSON.stringify(next, null, 2), "utf8");
    console.log("Updated data/runtime/store.json");
  } catch (e) {
    console.warn("store.json skip:", e.message);
  }
}

async function main() {
  await ensureBucket();
  const result = await uploadAll();
  if (result.fail > 0) {
    console.error("Some uploads failed — aborting DB rewrite");
    process.exit(1);
  }
  await rewriteDatabase();
  rewriteStoreJson();

  // smoke check
  const sample = toPublicUrl("/media/brand/he3.webp");
  const head = await fetch(sample, { method: "HEAD" });
  console.log("Sample URL", sample, "→", head.status);
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
