import { orderRepository } from "@/server/repositories";
import { jsonError, jsonOk, parseJson } from "@/server/api/http";
import { sendOrderEmails } from "@/server/email/order-emails";
import type { Order } from "@/domain/types";

export async function POST(req: Request) {
  const body = await parseJson<
    Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt">
  >(req);

  if (!body.customer?.fullName || !body.customer?.phone || !body.items?.length) {
    return jsonError("Invalid order payload");
  }

  const order = await orderRepository.create({
    ...body,
    status: body.status ?? "pending",
    paymentMethod: body.paymentMethod ?? "cod",
  });

  // Don't block checkout if email provider fails
  void sendOrderEmails(order);

  return jsonOk({ order }, { status: 201 });
}
