import { requireAdmin } from "@/server/api/require-admin";
import { jsonError, jsonOk, parseJson } from "@/server/api/http";
import { productRepository } from "@/server/repositories";
import type { Product } from "@/domain/types";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  const product = await productRepository.getById(id);
  if (!product) return jsonError("Not found", 404);
  return jsonOk({ product });
}

export async function PATCH(req: Request, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  const patch = await parseJson<Partial<Product>>(req);
  const product = await productRepository.update(id, patch);
  if (!product) return jsonError("Not found", 404);
  return jsonOk({ product });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  const ok = await productRepository.delete(id);
  if (!ok) return jsonError("Not found", 404);
  return jsonOk({ ok: true });
}
