import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { ProductsGrid } from "@/features/products/products-grid";
import { productRepository } from "@/features/products/repository";
import { media } from "@/data/catalog/media";

export const metadata = {
  title: "All Products — HANIA Electronics",
  description:
    "Emergency lights, solar lanterns, torches, headlamps and accessories — browse the full Hania Electronics catalog.",
};

const HERO_STATS = [
  { value: "9+", label: "Product Lines" },
  { value: "15k+", label: "Happy Customers" },
  { value: "2–5", label: "Day Delivery" },
];

export default async function ProductsPage() {
  const [allProducts, allCategories] = await Promise.all([
    productRepository.getAll(),
    productRepository.getCategories(),
  ]);

  return (
    <main className="min-h-screen bg-background">
      {/* ── Editorial Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#05070c] pt-[72px] text-white">
        {/* Background — lifestyle image */}
        <div className="absolute inset-0">
          {media.scenes.headlampLifestyle && (
            <Image
              src={media.scenes.headlampLifestyle}
              alt=""
              fill
              className="object-cover opacity-20"
              sizes="100vw"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#05070c] via-[#05070c]/90 to-[#05070c]/60" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 55% 50% at 15% 50%, rgba(34,211,238,0.07), transparent 55%)",
            }}
          />
        </div>

        <Container className="relative py-20 md:py-28">
          <Reveal variant="fade">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/35">
              Hania Electronics · Full Catalog
            </p>
          </Reveal>
          <Reveal variant="slide" delay={0.05}>
            <h1 className="mt-4 font-heading text-[clamp(2.2rem,5.5vw,4rem)] font-semibold leading-[1.04] tracking-[-0.04em]">
              Every light
              <br />
              <span className="text-primary-glow">we carry.</span>
            </h1>
          </Reveal>
          <Reveal variant="blur" delay={0.09}>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/45">
              Emergency, solar, everyday — Pakistan's most reliable lighting
              range, for home and work.
            </p>
          </Reveal>

          {/* Stats row */}
          <Reveal variant="fade" delay={0.13}>
            <div className="mt-10 flex flex-wrap gap-8">
              {HERO_STATS.map((s) => (
                <div key={s.label}>
                  <p className="font-heading text-2xl font-bold text-white">{s.value}</p>
                  <p className="mt-0.5 text-[12px] text-white/40">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── Products Grid + Filters ────────────────────────────────── */}
      <Suspense fallback={null}>
        <ProductsGrid products={allProducts} categories={allCategories} />
      </Suspense>
    </main>
  );
}
