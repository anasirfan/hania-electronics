import { notFound, redirect } from "next/navigation";
import { categoryRepository } from "@/server/repositories";

type Props = { params: Promise<{ id: string }> };

export default async function LegacyCategoryRedirect({ params }: Props) {
  const { id } = await params;
  const [bySlug, byId] = await Promise.all([
    categoryRepository.getBySlug(id),
    categoryRepository.getById(id),
  ]);
  const category = bySlug ?? byId;
  if (!category) notFound();
  redirect(`/shop/${category.slug}`);
}
