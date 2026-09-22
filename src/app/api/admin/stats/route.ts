import { requireAdmin } from "@/server/api/require-admin";
import { jsonOk } from "@/server/api/http";
import {
  orderRepository,
  productRepository,
  categoryRepository,
} from "@/server/repositories";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const [orders, products, categories] = await Promise.all([
    orderRepository.list(),
    productRepository.listAll(),
    categoryRepository.list(true),
  ]);

  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);
  const pending = orders.filter((o) => o.status === "pending").length;
  const lowStock = products.filter((p) => p.stockQuantity > 0 && p.stockQuantity <= 5);

  return jsonOk({
    totalOrders: orders.length,
    pendingOrders: pending,
    revenue,
    productCount: products.length,
    categoryCount: categories.length,
    lowStock,
    recentOrders: orders.slice(0, 8),
  });
}
