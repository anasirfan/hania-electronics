import { requireAdmin } from "@/server/api/require-admin";
import { jsonOk } from "@/server/api/http";
import { listMediaLibrary } from "@/server/storage/media-library";

export async function GET(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const url = new URL(req.url);
  const limit = Math.min(48, Math.max(1, Number(url.searchParams.get("limit") ?? 24)));
  const offset = Math.max(0, Number(url.searchParams.get("offset") ?? 0));
  const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();
  const folder = url.searchParams.get("folder") ?? "all";

  const all = await listMediaLibrary();
  const folders = [...new Set(all.map((file) => file.folder))].sort();
  const filtered = all.filter((file) => {
    if (folder !== "all" && file.folder !== folder) return false;
    if (!q) return true;
    return `${file.name} ${file.key}`.toLowerCase().includes(q);
  });

  return jsonOk({
    files: filtered.slice(offset, offset + limit),
    total: filtered.length,
    offset,
    limit,
    folders,
  });
}
