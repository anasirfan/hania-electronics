import { requireAdmin } from "@/server/api/require-admin";
import { jsonError, jsonOk, parseJson } from "@/server/api/http";
import { categoryRepository } from "@/server/repositories";
import type { Category } from "@/domain/types";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  const category = await categoryRepository.getById(id);
  if (!category) return jsonError("Not found", 404);
  return jsonOk({ category });
}

export async function PATCH(req: Request, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  const patch = await parseJson<Partial<Category>>(req);
  const category = await categoryRepository.update(id, patch);
  if (!category) return jsonError("Not found", 404);
  return jsonOk({ category });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  const ok = await categoryRepository.delete(id);
  if (!ok) return jsonError("Not found", 404);
  return jsonOk({ ok: true });
}
