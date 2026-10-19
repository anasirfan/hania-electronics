import { requireAdmin } from "@/server/api/require-admin";
import { jsonError, jsonOk, parseJson } from "@/server/api/http";
import { categoryBannersRepository } from "@/server/repositories";
import type { AboutBanner } from "@/domain/types";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const banners = await categoryBannersRepository.getAll();
  return jsonOk({ banners });
}

export async function PUT(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await parseJson<{ categoryId?: string; banners?: AboutBanner[] }>(req);
  if (!body.categoryId) return jsonError("categoryId is required");
  const banners = await categoryBannersRepository.set(
    body.categoryId,
    body.banners ?? [],
  );
  return jsonOk({ banners });
}
