import { requireAdmin } from "@/server/api/require-admin";
import { jsonError } from "@/server/api/http";
import { isSafeMediaKey } from "@/server/storage/media-library";
import { createServiceSupabase } from "@/server/supabase/client";

function contentType(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    case "avif":
      return "image/avif";
    case "svg":
      return "image/svg+xml";
    case "mp4":
      return "video/mp4";
    case "webm":
      return "video/webm";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    default:
      return "application/octet-stream";
  }
}

export async function GET(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const key = new URL(req.url).searchParams.get("key") ?? "";
  if (!isSafeMediaKey(key)) return jsonError("Invalid file", 400);

  const sb = createServiceSupabase();
  const { data, error: dlErr } = await sb.storage.from("uploads").download(key);
  if (dlErr || !data) return jsonError("File not found", 404);

  const name = key.split("/").pop() ?? "file";
  const bytes = Buffer.from(await data.arrayBuffer());
  return new Response(bytes, {
    headers: {
      "Content-Type": contentType(name),
      "Content-Disposition": `attachment; filename="${name.replace(/"/g, "")}"`,
      "Content-Length": String(bytes.length),
    },
  });
}
