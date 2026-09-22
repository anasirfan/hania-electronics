import { requireAdmin } from "@/server/api/require-admin";
import { jsonError, jsonOk, parseJson } from "@/server/api/http";
import { bannerRepository } from "@/server/repositories";
import type { Banner } from "@/domain/types";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  const patch = await parseJson<Partial<Banner>>(req);
  const banner = await bannerRepository.update(id, patch);
  if (!banner) return jsonError("Not found", 404);
  return jsonOk({ banner });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  const ok = await bannerRepository.delete(id);
  if (!ok) return jsonError("Not found", 404);
  return jsonOk({ ok: true });
}
