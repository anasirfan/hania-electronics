import type { AboutContent } from "@/domain/types";
import { defaultAboutContent } from "@/lib/about-content";
import {
  createServiceSupabase,
  isSupabaseConfigured,
} from "@/server/supabase/client";

/**
 * About page copy lives as a JSON document in the public `uploads` bucket
 * (same approach as site settings) so it needs no extra SQL migration.
 */
const STORAGE_PATH = "config/about-content.json";

async function readFromStorage(): Promise<AboutContent | null> {
  if (!isSupabaseConfigured()) return null;
  const sb = createServiceSupabase();
  const { data, error } = await sb.storage.from("uploads").download(STORAGE_PATH);
  if (error || !data) return null;
  try {
    const parsed = JSON.parse(await data.text()) as Partial<AboutContent>;
    const defaults = defaultAboutContent();
    return {
      ...defaults,
      ...parsed,
      banners: Array.isArray(parsed.banners) ? parsed.banners : defaults.banners,
    };
  } catch {
    return null;
  }
}

async function writeToStorage(content: AboutContent): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const sb = createServiceSupabase();
  const { error } = await sb.storage.from("uploads").upload(
    STORAGE_PATH,
    new Blob([JSON.stringify(content, null, 2)], { type: "application/json" }),
    { upsert: true, contentType: "application/json", cacheControl: "60" },
  );
  if (error) throw new Error(`About content write failed: ${error.message}`);
}

export const aboutContentRepository = {
  async get(): Promise<AboutContent> {
    try {
      const stored = await readFromStorage();
      if (stored) return stored;
    } catch (e) {
      console.warn("[about_content] storage read failed", e);
    }
    return defaultAboutContent();
  },

  async update(patch: Partial<AboutContent>): Promise<AboutContent> {
    const current = await this.get();
    const next: AboutContent = {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    await writeToStorage(next);
    return next;
  },
};
