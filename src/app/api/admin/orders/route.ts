import { requireAdmin } from "@/server/api/require-admin";
import { jsonOk } from "@/server/api/http";
import {
  orderRepository,
  productRepository,
} from "@/server/repositories";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const [orders, products] = await Promise.all([
    orderRepository.list(),
    productRepository.listAll(),
  ]);
  return jsonOk({ orders, products });
}
