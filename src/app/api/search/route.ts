import { productRepository } from "@/server/repositories";
import { jsonOk } from "@/server/api/http";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const products = await productRepository.search(q);
  return jsonOk({ products: products.slice(0, 12) });
}
