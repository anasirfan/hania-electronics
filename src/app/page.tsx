import type { Metadata } from "next";
import {
  bannerRepository,
  categoryRepository,
  homepageRepository,
  productRepository,
} from "@/server/repositories";
import { BannerCarousel } from "@/features/cms/banner-carousel";
import {
  MarketingBannerSection,
  ProductRail,
  ShopByCategorySection,
  TrustBenefitsSection,
} from "@/features/home/commerce-sections";
import { NewsletterSection } from "@/features/home/sections/newsletter";
import type { Product } from "@/domain/types";

export const metadata: Metadata = {
  title: "Shop Premium Lighting",
  description:
    "HANIA Electronics — metal lights, flash lights, and solar lights with cash on delivery across Pakistan.",
};

function pickProducts(all: Product[], ids: string[], fallback: Product[]) {
  const byId = new Map(all.map((p) => [p.id, p]));
  const picked = ids.map((id) => byId.get(id)).filter(Boolean) as Product[];
  return picked.length ? picked : fallback;
}

export default async function HomePage() {
  const [categories, products, banners, homepage] = await Promise.all([
    categoryRepository.list(false),
    productRepository.list({ publishedOnly: true }),
    bannerRepository.list(true),
    homepageRepository.get(),
  ]);

  const featuredCats = homepage.featuredCategoryIds.length
    ? categories.filter((c) => homepage.featuredCategoryIds.includes(c.id))
    : categories;

  const bestSellers = pickProducts(
    products,
    homepage.bestSellerProductIds,
    products.filter((p) => p.bestSeller),
  );
  const saleProducts = pickProducts(
    products,
    homepage.saleProductIds,
    products.filter((p) => p.salePrice != null),
  );
  const newArrivals = pickProducts(
    products,
    homepage.newArrivalProductIds,
    products.filter((p) => p.newArrival),
  );
  const featured = pickProducts(
    products,
    homepage.featuredProductIds,
    products.filter((p) => p.featured),
  );

  const marketingBanner = homepage.marketingBannerId
    ? banners.find((b) => b.id === homepage.marketingBannerId)
    : banners[0];

  return (
    <>
      <BannerCarousel banners={banners} />
      {homepage.sections.categories ? (
        <ShopByCategorySection categories={featuredCats} />
      ) : null}
      {homepage.sections.bestSellers ? (
        <ProductRail
          title="Popular Picks"
          subtitle="Most loved lights across Pakistan."
          products={bestSellers}
          href="/shop?sort=featured"
        />
      ) : null}
      {homepage.sections.sale ? (
        <ProductRail
          title="On Sale"
          subtitle="Limited-time savings on selected SKUs."
          products={saleProducts}
          href="/shop?sale=1"
        />
      ) : null}
      {homepage.sections.newArrivals ? (
        <ProductRail
          title="New Arrivals"
          subtitle="Fresh stock just landed."
          products={newArrivals}
          href="/shop?sort=newest"
        />
      ) : null}
      {homepage.sections.featured ? (
        <ProductRail
          title="Featured Products"
          subtitle="Hand-picked for everyday reliability."
          products={featured}
        />
      ) : null}
      {homepage.sections.trust ? <TrustBenefitsSection /> : null}
      {homepage.sections.marketingBanner && marketingBanner ? (
        <MarketingBannerSection
          title={marketingBanner.title}
          subtitle={marketingBanner.subtitle}
          href={marketingBanner.ctaLink || "/shop"}
          image={marketingBanner.desktopImage}
        />
      ) : null}
      {homepage.sections.newsletter ? <NewsletterSection /> : null}
    </>
  );
}
