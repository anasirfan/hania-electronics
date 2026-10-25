import {
  createServiceSupabase,
  isSupabaseConfigured,
} from "@/server/supabase/client";

export type MediaFile = {
  key: string;
  name: string;
  folder: string;
  size: number;
  updatedAt: string;
  url: string;
};

const IMAGE_EXT = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
  "avif",
  "svg",
  "mp4",
  "webm",
]);

type Listed = {
  name: string;
  id: string | null;
  updated_at?: string | null;
  created_at?: string | null;
  metadata?: { size?: number } | null;
};

function publicUrl(key: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const encoded = key.split("/").map(encodeURIComponent).join("/");
  if (!base) return `/${encoded}`;
  return `${base}/storage/v1/object/public/uploads/${encoded}`;
}

function isFolder(item: Listed): boolean {
  return item.id == null || item.metadata == null;
}

async function listPrefix(prefix: string): Promise<Listed[]> {
  const sb = createServiceSupabase();
  const all: Listed[] = [];
  let offset = 0;
  for (;;) {
    const { data, error } = await sb.storage.from("uploads").list(prefix, {
      limit: 100,
      offset,
      sortBy: { column: "name", order: "asc" },
    });
    if (error) throw new Error(error.message);
    const batch = (data ?? []) as Listed[];
    all.push(...batch);
    if (batch.length < 100) break;
    offset += batch.length;
  }
  return all;
}

async function walk(prefix: string, out: MediaFile[]): Promise<void> {
  if (prefix === "config" || prefix.startsWith("config/")) return;
  const items = await listPrefix(prefix);
  for (const item of items) {
    if (!item.name || item.name.startsWith(".")) continue;
    const key = prefix ? `${prefix}/${item.name}` : item.name;
    if (isFolder(item)) {
      await walk(key, out);
      continue;
    }
    const ext = item.name.split(".").pop()?.toLowerCase() ?? "";
    if (!IMAGE_EXT.has(ext)) continue;
    out.push({
      key,
      name: item.name,
      folder: prefix || "root",
      size: item.metadata?.size ?? 0,
      updatedAt: item.updated_at ?? item.created_at ?? "",
      url: publicUrl(key),
    });
  }
}

export async function listMediaLibrary(): Promise<MediaFile[]> {
  if (!isSupabaseConfigured()) return [];
  const files: MediaFile[] = [];
  await walk("", files);
  files.sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
  return files;
}

export function isSafeMediaKey(key: string): boolean {
  if (!key || key.startsWith("/") || key.includes("..") || key.includes("\\")) {
    return false;
  }
  if (key === "config" || key.startsWith("config/")) return false;
  const ext = key.split(".").pop()?.toLowerCase() ?? "";
  return IMAGE_EXT.has(ext);
}
