import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Container } from "@/components/layout/container";
import { AboutHeroMedia } from "@/features/about/about-hero-media";
import { ShopCatalog } from "@/features/shop/shop-catalog";
import type { AboutBanner } from "@/domain/types";
import {
  categoryBannersRepository,
  categoryRepository,
  productRepository,
} from "@/server/repositories";

export const dynamic = "force-dynamic";

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
  const category = await categoryRepository.getBySlug(slug);
  if (!category) notFound();

  const [products, categories, storedBanners] = await Promise.all([
    productRepository.list({ publishedOnly: true }),
    categoryRepository.list(false),
    categoryBannersRepository.get(category.id),
  ]);

  const banners: AboutBanner[] =
    storedBanners.length > 0
      ? storedBanners
      : category.image
        ? [
            {
              id: `${category.id}-image`,
              desktopImage: category.image,
              mobileImage: category.image,
              alt: category.name,
            },
          ]
        : [];

  return (
    <div className="bg-[#FAFBFD]">
      <section className="relative min-h-[46vh] overflow-hidden bg-[#0d1526] text-white md:min-h-[52vh]">
        <AboutHeroMedia
          banners={banners}
          desktopClassName="cinematic-grade hidden object-cover object-center md:block"
          mobileClassName="cinematic-grade object-cover object-center md:hidden"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <Container className="relative flex min-h-[46vh] flex-col justify-end pb-12 pt-16 md:min-h-[52vh] md:pb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">
            Category
          </p>
          <h1 className="mt-3 max-w-3xl font-heading text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-white">
            {category.name}
          </h1>
          {category.description ? (
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/65">
              {category.description}
            </p>
          ) : null}
        </Container>
      </section>

      <Container className="py-10 md:py-14">
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
