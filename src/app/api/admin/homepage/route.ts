import { requireAdmin } from "@/server/api/require-admin";
import { jsonOk, parseJson } from "@/server/api/http";
import { homepageRepository } from "@/server/repositories";
import type { HomepageConfig } from "@/domain/types";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const homepage = await homepageRepository.get();
  return jsonOk({ homepage });
}

export async function PATCH(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const patch = await parseJson<Partial<HomepageConfig>>(req);
  const homepage = await homepageRepository.update(patch);
  return jsonOk({ homepage });
}
