import { requireAdmin } from "@/server/api/require-admin";
import { jsonError, jsonOk } from "@/server/api/http";
import { productRepository } from "@/server/repositories";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_req: Request, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  const product = await productRepository.duplicate(id);
  if (!product) return jsonError("Not found", 404);
  return jsonOk({ product }, { status: 201 });
}
