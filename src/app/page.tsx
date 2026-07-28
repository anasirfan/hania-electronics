import { TrustMarquee } from "@/components/layout/marquee";
import { HeroSection } from "@/features/home/sections/hero";
import { TrustedBySection } from "@/features/home/sections/trusted-by";
import { CategoriesSection } from "@/features/home/sections/categories";
import { BestSellersSection } from "@/features/home/sections/bestsellers";
import { WhyHaniaSection } from "@/features/home/sections/why-hania";
import { ShopByPurposeSection } from "@/features/home/sections/shop-by-purpose";
import { DealerCtaSection } from "@/features/home/sections/dealer-cta";
import { LifestyleBannerSection } from "@/features/home/sections/lifestyle-banner";
import { MidBannerSection } from "@/features/home/sections/mid-banner";
import { TestimonialsSection } from "@/features/home/sections/testimonials";
import { FaqSection } from "@/features/home/sections/faq";
import { NewsletterSection } from "@/features/home/sections/newsletter";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustedBySection />
      <TrustMarquee />
      <CategoriesSection />
      <BestSellersSection />
      <MidBannerSection />
      <WhyHaniaSection />
      <ShopByPurposeSection />
      <DealerCtaSection />
      <LifestyleBannerSection />
      <TestimonialsSection />
      <FaqSection />
      <NewsletterSection />
    </>
  );
}
