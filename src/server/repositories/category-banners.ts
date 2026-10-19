import type { AboutBanner } from "@/domain/types";
import {
  createServiceSupabase,
  isSupabaseConfigured,
} from "@/server/supabase/client";

/**
 * Per-category page banners, stored as JSON in the public `uploads` bucket
 * so the category table does not need a new column.
 */
const STORAGE_PATH = "config/category-banners.json";

type Store = Record<string, AboutBanner[]>;

function normalize(raw: unknown): Store {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: Store = {};
  for (const [id, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!Array.isArray(value)) continue;
    out[id] = value.filter(
      (b): b is AboutBanner =>
        !!b &&
        typeof b === "object" &&
        typeof (b as AboutBanner).desktopImage === "string",
    );
  }
  return out;
}

async function readAll(): Promise<Store> {
  if (!isSupabaseConfigured()) return {};
  const sb = createServiceSupabase();
  const { data, error } = await sb.storage.from("uploads").download(STORAGE_PATH);
  if (error || !data) return {};
  try {
    return normalize(JSON.parse(await data.text()));
  } catch {
    return {};
  }
}

async function writeAll(store: Store): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const sb = createServiceSupabase();
  const { error } = await sb.storage.from("uploads").upload(
    STORAGE_PATH,
    new Blob([JSON.stringify(store, null, 2)], { type: "application/json" }),
    { upsert: true, contentType: "application/json", cacheControl: "60" },
  );
  if (error) throw new Error(`Category banners write failed: ${error.message}`);
}

export const categoryBannersRepository = {
  async getAll(): Promise<Store> {
    try {
      return await readAll();
    } catch (e) {
      console.warn("[category_banners] read failed", e);
      return {};
    }
  },

  async get(categoryId: string): Promise<AboutBanner[]> {
    const all = await this.getAll();
    return all[categoryId] ?? [];
  },

  async set(categoryId: string, banners: AboutBanner[]): Promise<AboutBanner[]> {
    const all = await this.getAll();
    const next = banners
      .filter((b) => b.desktopImage)
      .map((b) => ({
        id: b.id || `cat-banner-${Date.now()}`,
        desktopImage: b.desktopImage,
        mobileImage: b.mobileImage || b.desktopImage,
        alt: b.alt ?? "",
      }));
    all[categoryId] = next;
    await writeAll(all);
    return next;
  },

  async remove(categoryId: string): Promise<void> {
    const all = await this.getAll();
    if (!(categoryId in all)) return;
    delete all[categoryId];
    await writeAll(all);
  },
};
