import { orderRepository } from "@/server/repositories";
import { jsonError, jsonOk } from "@/server/api/http";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderNumber = searchParams.get("orderNumber") ?? "";
  const phone = searchParams.get("phone") ?? "";
  if (!orderNumber || !phone) {
    return jsonError("Order number and phone are required");
  }
  const order = await orderRepository.track(orderNumber, phone);
  if (!order) return jsonError("Order not found", 404);
  return jsonOk({ order });
}
