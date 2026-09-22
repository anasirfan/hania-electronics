import { requireAdmin } from "@/server/api/require-admin";
import { jsonError, jsonOk, parseJson } from "@/server/api/http";
import { orderRepository } from "@/server/repositories";
import type { OrderStatus } from "@/domain/types";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  const order = await orderRepository.getById(id);
  if (!order) return jsonError("Not found", 404);
  return jsonOk({ order });
}

export async function PATCH(req: Request, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  const body = await parseJson<{ status: OrderStatus }>(req);
  const order = await orderRepository.updateStatus(id, body.status);
  if (!order) return jsonError("Not found", 404);
  return jsonOk({ order });
}
