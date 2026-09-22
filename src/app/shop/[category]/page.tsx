import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Container } from "@/components/layout/container";
import { ShopCatalog } from "@/features/shop/shop-catalog";
import {
  categoryRepository,
  productRepository,
} from "@/server/repositories";

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await categoryRepository.getBySlug(slug);
  if (!category) return { title: "Category" };
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryShopPage({ params }: Props) {
  const { category: slug } = await params;
  const [products, categories, category] = await Promise.all([
    productRepository.list({ publishedOnly: true }),
    categoryRepository.list(false),
    categoryRepository.getBySlug(slug),
  ]);

  if (!category) notFound();

  return (
    <div className="bg-[#FAFBFD] py-10 md:py-14">
      <Container>
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Category
          </p>
          <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight">
            {category.name}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            {category.description}
          </p>
        </div>
        <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
          <ShopCatalog
            products={products}
            categories={categories}
            activeCategorySlug={slug}
          />
        </Suspense>
      </Container>
    </div>
  );
}
