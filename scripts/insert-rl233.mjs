import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";

const raw = readFileSync(".env.local", "utf8");
for (const line of raw.split(/\r?\n/)) {
  if (!line || line.startsWith("#")) continue;
  const i = line.indexOf("=");
  if (i === -1) continue;
  if (!process.env[line.slice(0, i)]) process.env[line.slice(0, i)] = line.slice(i + 1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const sb = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const cat =
  "C:\\Users\\Administrator\\Downloads\\wetransfer_light-your-night_2026-10-03_0824\\Light Your Night";
const folder = readdirSync(cat).find((d) => /RL233/i.test(d));
const dir = path.join(cat, folder);
const files = readdirSync(dir)
  .filter((n) => /\.(png|jpe?g|webp)$/i.test(n))
  .sort();
const now = new Date().toISOString();
const name = "Ruilang RL-233 Multifunctional LED Torch";
const slug = "ruilang-rl-233-multifunctional-led-torch";
const price = 2000;
const urls = [];

for (let i = 0; i < files.length; i++) {
  const full = path.join(dir, files[i]);
  const ext = path.extname(files[i]).toLowerCase();
  const key = `products/lyn/${slug}/${String(i + 1).padStart(2, "0")}${ext}`;
  const body = readFileSync(full);
  const { error } = await sb.storage.from("uploads").upload(key, body, {
    contentType: ext === ".png" ? "image/png" : "image/jpeg",
    upsert: true,
    cacheControl: "31536000",
  });
  if (error) throw error;
  urls.push(`${url.replace(/\/$/, "")}/storage/v1/object/public/uploads/${key}`);
}

const row = {
  id: "p-lyn-rl233",
  name,
  slug,
  sku: "HE-LYN-RL233-EST",
  category_id: "cat-light-your-night",
  short_description:
    "Multifunctional LED flashlight with cutter, hammer, and strong magnet.",
  description:
    "Ruilang RL-233 multifunctional LED torch with cutter, hammer, and strong magnet. Listed at an estimated Rs 2,000 until the final price is confirmed.",
  price,
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
    alt: name,
    sortOrder: i,
    isPrimary: i === 0,
  })),
  specifications: {
    Warranty: "6 months",
    Origin: "Imported",
    PriceStatus: "Estimated — pending confirmation",
  },
  features: ["Cutter", "Hammer", "Strong magnet", "LED torch"],
  tags: ["lyn", "price-estimated"],
  seo_title: `${name} | HANIA Electronics`,
  seo_description: "Ruilang RL-233 multifunctional LED torch.",
  published: true,
  created_at: now,
  updated_at: now,
};

const { error } = await sb.from("products").upsert(row);
if (error) throw error;
console.log("Inserted", name, "Rs", price, urls.length, "images");
