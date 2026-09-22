import { requireAdmin } from "@/server/api/require-admin";
import { jsonError, jsonOk, parseJson } from "@/server/api/http";
import { categoryRepository } from "@/server/repositories";
import type { Category } from "@/domain/types";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const categories = await categoryRepository.list(true);
  return jsonOk({ categories });
}

export async function POST(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await parseJson<Omit<Category, "id" | "createdAt" | "updatedAt">>(
    req,
  );
  if (!body.name || !body.slug) return jsonError("Name and slug required");
  const category = await categoryRepository.create({
    name: body.name,
    slug: body.slug,
    description: body.description ?? "",
    image: body.image ?? null,
    featured: body.featured ?? false,
    sortOrder: body.sortOrder ?? 99,
    active: body.active ?? true,
  });
  return jsonOk({ category }, { status: 201 });
}
