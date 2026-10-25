import { requireAdmin } from "@/server/api/require-admin";
import { jsonOk } from "@/server/api/http";
import { listMediaLibrary } from "@/server/storage/media-library";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const files = await listMediaLibrary();
  return jsonOk({ files });
}
