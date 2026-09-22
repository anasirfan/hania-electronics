import { requireAdmin } from "@/server/api/require-admin";
import { jsonError, jsonOk, parseJson } from "@/server/api/http";
import { productRepository } from "@/server/repositories";
import type { Product } from "@/domain/types";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const products = await productRepository.listAll();
  return jsonOk({ products });
}

export async function POST(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await parseJson<Omit<Product, "id" | "createdAt" | "updatedAt">>(
    req,
  );
  if (!body.name || !body.slug || !body.sku || !body.categoryId) {
    return jsonError("Missing required product fields");
  }
  const product = await productRepository.create({
    ...body,
    salePrice: body.salePrice ?? null,
    compareAtPrice: body.compareAtPrice ?? null,
    stockQuantity: body.stockQuantity ?? 0,
    stockStatus: body.stockStatus ?? "in_stock",
    featured: body.featured ?? false,
    bestSeller: body.bestSeller ?? false,
    newArrival: body.newArrival ?? false,
    saleBadge: body.saleBadge ?? false,
    manualBadges: body.manualBadges ?? [],
    images: body.images ?? [],
    specifications: body.specifications ?? {},
    features: body.features ?? [],
    tags: body.tags ?? [],
    shortDescription: body.shortDescription ?? "",
    description: body.description ?? "",
    seoTitle: body.seoTitle ?? body.name,
    seoDescription: body.seoDescription ?? body.shortDescription ?? "",
    published: body.published ?? false,
  });
  return jsonOk({ product }, { status: 201 });
}
