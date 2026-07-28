import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { ProductCard } from "@/features/products/product-card";
import { productRepository } from "@/features/products/repository";
import type { CategoryId } from "@/features/products/types";

export async function generateStaticParams() {
  const categories = await productRepository.getCategories();
  return categories.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categories = await productRepository.getCategories();
  const cat = categories.find((c) => c.id === id);
  if (!cat) return {};
  return {
    title: `${cat.name} — HANIA Electronics`,
    description: cat.description,
  };
}

// Buying guide copy per category
const BUYING_GUIDES: Record<string, { title: string; tips: string[] }> = {
  torch: {
    title: "How to choose the right torch",
    tips: [
      "Consider lumens for brightness, but also beam distance — a 1000ft beam matters more than raw lumens for outdoor use.",
      "IP ratings tell you water resistance. IP64 handles rain and splashes; IP65 handles pressurised water jets.",
      "Lithium-ion gives you USB charging and longer runtime. Check that the battery is standard-format (18650) so it's replaceable.",
      "For EDC (everyday carry), choose a torch under 200g that fits your pocket without strain.",
    ],
  },
  solar: {
    title: "How to choose a solar light",
    tips: [
      "Panel size determines how fast it charges. A monocrystalline panel charges faster in partial sun than a polycrystalline panel of the same size.",
      "Battery capacity (mAh) determines runtime. 2000 mAh gives roughly 8 hours on high or 16+ hours on low.",
      "Check for a USB backup input — for cloudy Pakistani days when solar charging alone isn't enough.",
      "Warm white (3000K) is better for indoor/home use. Cool white (6000K) is better for work and inspection.",
    ],
  },
  emergency: {
    title: "How to choose emergency lighting",
    tips: [
      "For car emergencies, prioritise: power bank function, safety hammer, seatbelt cutter, and 120dB+ alarm. The 8-in-1 covers all of these.",
      "Runtime matters more than lumens in an emergency. A light that lasts 8 hours beats a brighter one that lasts 2.",
      "Keep one charged and accessible at all times — an emergency light that's dead is useless. Check the charge monthly.",
      "SOS mode extends battery life by flashing intermittently while still being visible from a distance.",
    ],
  },
  "head-lamps": {
    title: "How to choose a headlamp",
    tips: [
      "Look for a 4-level battery indicator — you should always know how much runtime you have left before starting a job.",
      "Wide beam (120°+) is for area illumination. Spot beam (15°) is for distance. The best headlamps offer both.",
      "USB-C charging means any cable you already carry will work. Avoid headlamps with proprietary charging ports.",
      "Weight matters for extended wear. Under 100g is comfortable for hours. Over 150g causes neck fatigue on long jobs.",
    ],
  },
  bulbs: {
    title: "How to choose LED bulbs",
    tips: [
      "Match your base type — E27 is the standard screw base in most Pakistani homes. B22 is the bayonet base. Double-check before ordering.",
      "Color temperature: 3000K is warm white (cosy, living rooms). 4000K is neutral. 6500K is cool daylight (offices, task lighting).",
      "CRI (Color Rendering Index) above 80 means colors look accurate under the light — important for kitchens and workspaces.",
      "Wattage is power consumption, not brightness. A 9W LED gives the same light as a 60W incandescent.",
    ],
  },
  outdoor: {
    title: "How to choose work & outdoor lights",
    tips: [
      "COB (Chip-on-Board) technology gives wider, more even light than spot LEDs — better for illuminating a workspace vs. a focused beam.",
      "Magnetic bases are more useful than they sound — they let you position the light hands-free on any metal surface, which matters on job sites.",
      "4000+ mAh battery for full-shift use. Anything less may not last a complete 8-hour working day on high.",
      "Check that the light has multiple mounting options (magnet + stand + hook) for maximum versatility across different work environments.",
    ],
  },
  accessories: {
    title: "How to choose the right accessories",
    tips: [
      "For trimmers: blade material matters. Stainless steel blades outlast standard steel and resist corrosion in humid conditions.",
      "Cordless is always more convenient. Check runtime (minutes per charge) against your typical session length.",
      "USB-C charging is the standard you want — it means you can charge with any modern cable without carrying a dedicated adapter.",
      "Travel lock is non-negotiable if you're packing the device in luggage. One accidental activation in a bag can drain the battery completely.",
    ],
  },
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [categories, allProducts] = await Promise.all([
    productRepository.getCategories(),
    productRepository.getByCategory(id as CategoryId),
  ]);

  const category = categories.find((c) => c.id === id);
  if (!category) notFound();

  const otherCategories = categories.filter((c) => c.id !== id).slice(0, 4);
  const guide = BUYING_GUIDES[id];
  const catLabel = category.name;

  return (
    <main className="min-h-screen bg-background">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0d1526] pt-[72px] text-white">
        {category.image && (
          <div className="absolute inset-0">
            <Image
              src={category.image}
              alt={catLabel}
              fill
              className="object-cover opacity-25"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d1526] via-[#0d1526]/80 to-transparent" />
          </div>
        )}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 50% at 10% 50%, rgba(34,211,238,0.08), transparent 55%)",
          }}
        />

        <Container className="relative py-20 md:py-28">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-1.5 text-[12px] text-white/40">
            <Link href="/" className="transition hover:text-white/70">Home</Link>
            <ChevronRight className="h-3 w-3 opacity-40" />
            <Link href="/products" className="transition hover:text-white/70">Products</Link>
            <ChevronRight className="h-3 w-3 opacity-40" />
            <span className="text-white/70">{catLabel}</span>
          </nav>

          <Reveal variant="fade">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/35">
              Category
            </p>
          </Reveal>
          <Reveal variant="slide" delay={0.05}>
            <h1 className="mt-3 font-heading text-[clamp(2.2rem,5vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.04em]">
              {catLabel}
            </h1>
          </Reveal>
          <Reveal variant="blur" delay={0.08}>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/50">
              {category.description}
            </p>
          </Reveal>

          <Reveal variant="fade" delay={0.12}>
            <div className="mt-6 flex items-center gap-4">
              <span className="text-[13px] text-white/40">
                {allProducts.length} product{allProducts.length !== 1 ? "s" : ""}
              </span>
              <span className="h-4 w-px bg-white/15" />
              <Link
                href="/products"
                className="text-[13px] text-white/40 transition hover:text-white"
              >
                View all products
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── Products ──────────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <Container>
          {allProducts.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {allProducts.map((product, i) => (
                <Reveal key={product.id} variant="scale" delay={Math.min(i * 0.05, 0.25)}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="font-heading text-xl font-semibold text-foreground">
                No products yet
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                New products in this category are coming soon.
              </p>
              <Link
                href="/products"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition hover:border-foreground/20"
              >
                Browse all products
              </Link>
            </div>
          )}
        </Container>
      </section>

      {/* ── Buying guide ─────────────────────────────────────── */}
      {guide && (
        <section className="border-t border-border/40 bg-accent/30 py-16 md:py-24">
          <Container>
            <div className="mx-auto max-w-2xl">
              <Reveal variant="fade">
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
                  Buying guide
                </p>
              </Reveal>
              <Reveal variant="mask" delay={0.04}>
                <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  {guide.title}
                </h2>
              </Reveal>

              <div className="mt-8 space-y-4">
                {guide.tips.map((tip, i) => (
                  <Reveal key={i} variant="slide" delay={i * 0.05}>
                    <div className="flex gap-4 rounded-2xl border border-border/50 bg-card p-5">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-[11px] font-bold text-primary">
                        {i + 1}
                      </span>
                      <p className="text-[14px] leading-relaxed text-foreground/80">
                        {tip}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ── Related categories ────────────────────────────────── */}
      {otherCategories.length > 0 && (
        <section className="border-t border-border/40 py-16 md:py-20">
          <Container>
            <Reveal variant="fade">
              <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
                Explore other categories
              </h2>
            </Reveal>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {otherCategories.map((cat, i) => (
                <Reveal key={cat.id} variant="scale" delay={i * 0.05}>
                  <Link
                    href={`/categories/${cat.id}`}
                    className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card transition hover:border-foreground/15 hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12)]"
                  >
                    {cat.image && (
                      <div className="relative h-32 w-full overflow-hidden">
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                      </div>
                    )}
                    <div className="flex items-center justify-between px-4 py-3">
                      <div>
                        <p className="font-heading text-[14px] font-semibold text-foreground">
                          {cat.name}
                        </p>
                        <p className="text-[12px] text-muted-foreground">
                          {cat.description}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}
    </main>
  );
}
