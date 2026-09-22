import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/layout/container";
import { ShopCatalog } from "@/features/shop/shop-catalog";
import {
  categoryRepository,
  productRepository,
} from "@/server/repositories";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse all HANIA Electronics lighting products.",
};

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    productRepository.list({ publishedOnly: true }),
    categoryRepository.list(false),
  ]);

  return (
    <div className="bg-[#FAFBFD] py-10 md:py-14">
      <Container>
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            Shop
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Filter by category, price, availability, and more.
          </p>
        </div>
        <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
          <ShopCatalog products={products} categories={categories} />
        </Suspense>
      </Container>
    </div>
  );
}
