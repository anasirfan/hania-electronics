import { requireAdmin } from "@/server/api/require-admin";
import { jsonError, jsonOk } from "@/server/api/http";
import { imageStorage } from "@/server/storage/image-storage";

export async function POST(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const form = await req.formData();
  const file = form.get("file");
  const folder = String(form.get("folder") ?? "misc");

  if (!(file instanceof File)) {
    return jsonError("file is required");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploaded = await imageStorage.upload(buffer, folder, file.name);
  return jsonOk(uploaded, { status: 201 });
}
