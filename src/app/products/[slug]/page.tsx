import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  MessageCircle,
  Phone,
  Shield,
  Truck,
  Star,
  Heart,
  Share2,
  GitCompareArrows,
  Zap,
  Battery,
  Package,
  Plug,
  AlertTriangle,
  Volume2,
  Car,
  Eye,
  Moon,
  Sun,
  Clock,
  Home,
  Hammer,
  Magnet,
  Wrench,
  TrendingDown,
  Lightbulb,
  Tent,
  Feather,
  Flame,
  Scissors,
  Lock,
  Check,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { PdpGallery } from "@/features/products/pdp-gallery";
import { PdpStickyBuy } from "@/features/products/pdp-sticky-buy";
import { ProductCard } from "@/features/products/product-card";
import { productRepository } from "@/features/products/repository";
import { getProductDetail } from "@/data/catalog/product-details";
import { formatPKR, cn } from "@/lib/utils";
import { productWhatsAppMessage, whatsappUrl, BRAND, telUrl } from "@/lib/brand";
import { FaqItem } from "./faq-item";

// Map string icon name → Lucide component
const ICONS: Record<string, React.ElementType> = {
  Zap, Battery, Package, Plug, AlertTriangle, Volume2, Car, Eye, Moon, Sun,
  Clock, Home, Hammer, Magnet, Wrench, TrendingDown, Lightbulb, Tent, Feather,
  Flame, Scissors, Lock, Shield, Star, Truck, Heart, Check,
};

function getIcon(name: string): React.ElementType {
  return ICONS[name] ?? Zap;
}

export async function generateStaticParams() {
  const products = await productRepository.getAll();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await productRepository.getBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} — HANIA Electronics`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await productRepository.getBySlug(slug);
  if (!product) notFound();

  const detail = getProductDetail(product.id);
  const related = (await productRepository.getByCategory(product.category))
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const waUrl = whatsappUrl(productWhatsAppMessage(product.name, product.pricePkr));
  const dealerWaUrl = whatsappUrl(`I'm interested in wholesale pricing for ${product.name}.`);

  const galleryImages = detail
    ? detail.gallery.map((src, i) => ({
        src,
        alt: i === 0 ? product.name : `${product.name} in use`,
        label: i === 0 ? "Product" : i === 1 ? "In Use" : "Scene",
      }))
    : [{ src: product.image, alt: product.name, label: "Product" }];

  const savings = product.compareAtPkr
    ? Math.round(((product.compareAtPkr - product.pricePkr) / product.compareAtPkr) * 100)
    : null;

  const catLabel = product.category.replace(/-/g, " ");

  return (
    <main className="min-h-screen bg-background">
      {/* ── Sticky compact buy bar ─────────────────────────────────── */}
      <PdpStickyBuy product={product} waUrl={waUrl} />

      {/* ── Breadcrumb ─────────────────────────────────────────────── */}
      <div className="border-b border-border/40 bg-background/90 pt-[72px] backdrop-blur-md">
        <Container className="py-3.5">
          <nav className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <Link href="/" className="transition hover:text-foreground">Home</Link>
            <ChevronRight className="h-3 w-3 opacity-40" />
            <Link href="/products" className="transition hover:text-foreground">Products</Link>
            <ChevronRight className="h-3 w-3 opacity-40" />
            <Link
              href={`/products?category=${product.category}`}
              className="capitalize transition hover:text-foreground"
            >
              {catLabel}
            </Link>
            <ChevronRight className="h-3 w-3 opacity-40" />
            <span className="max-w-[180px] truncate text-foreground">{product.name}</span>
          </nav>
        </Container>
      </div>

      {/* ── Hero: sticky gallery + info ────────────────────────────── */}
      <section className="relative lg:flex">
        {/* LEFT: Gallery — sticky on desktop */}
        <div className="relative lg:sticky lg:top-[72px] lg:h-[calc(100vh-72px)] lg:w-[58%] lg:shrink-0">
          {/* Mobile: fixed aspect ratio */}
          <div className="aspect-[4/3] lg:hidden">
            <div className="relative h-full w-full bg-[#0d1526]">
              {product.image ? (
                <>
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%]"
                    style={{
                      background:
                        "radial-gradient(ellipse 70% 55% at 50% 100%, rgba(34,211,238,0.18), transparent 68%)",
                    }}
                  />
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-8"
                    sizes="100vw"
                    priority
                  />
                </>
              ) : null}
            </div>
          </div>

          {/* Desktop: full-height gallery component */}
          <div className="hidden h-full lg:block">
            <PdpGallery images={galleryImages} productName={product.name} />
          </div>
        </div>

        {/* RIGHT: Product info */}
        <div className="flex-1 border-l border-border/30">
          <div className="px-6 py-10 md:px-10 lg:px-12 lg:py-14 xl:px-16">

            {/* Category + badge */}
            <Reveal variant="fade">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
                  {catLabel}
                </span>
                {product.badge && (
                  <Badge variant={product.badge}>{product.badge}</Badge>
                )}
              </div>
            </Reveal>

            {/* Product name */}
            <Reveal variant="slide" delay={0.04}>
              <h1 className="mt-3 font-heading text-[clamp(1.9rem,3.2vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-foreground">
                {product.name}
              </h1>
            </Reveal>

            {/* Tagline */}
            {detail?.tagline && (
              <Reveal variant="blur" delay={0.07}>
                <p className="mt-2.5 text-base font-medium leading-snug text-muted-foreground">
                  {detail.tagline}
                </p>
              </Reveal>
            )}

            {/* Rating row */}
            <Reveal variant="fade" delay={0.09}>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3.5 w-3.5",
                        i < 5 ? "fill-amber-400 text-amber-400" : "text-muted",
                      )}
                    />
                  ))}
                </div>
                <span className="text-[13px] font-semibold text-foreground">4.8</span>
                <span className="text-[13px] text-muted-foreground">· 124 reviews</span>
              </div>
            </Reveal>

            {/* Divider */}
            <div className="my-6 border-t border-border/60" />

            {/* Price */}
            <Reveal variant="fade" delay={0.11}>
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-heading text-[2.25rem] font-bold tracking-tight text-foreground">
                  {formatPKR(product.pricePkr)}
                </span>
                {product.compareAtPkr && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPKR(product.compareAtPkr)}
                  </span>
                )}
                {savings && (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-[11px] font-bold text-green-700">
                    Save {savings}%
                  </span>
                )}
              </div>
            </Reveal>

            {/* Meta — warranty + delivery */}
            <Reveal variant="fade" delay={0.13}>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1.5 text-[12px] font-medium text-foreground/70">
                  <Shield className="h-3.5 w-3.5 text-primary" />
                  {detail?.warranty ?? "6 months"} warranty
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1.5 text-[12px] font-medium text-foreground/70">
                  <Truck className="h-3.5 w-3.5 text-primary" />
                  {detail?.delivery ?? "2–5 days across Pakistan"}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium",
                    product.inStock
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700",
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      product.inStock ? "bg-green-500" : "bg-red-500",
                    )}
                  />
                  {product.inStock ? "In stock" : "Out of stock"}
                </span>
              </div>
            </Reveal>

            {/* Key features */}
            {product.features.length > 0 && (
              <Reveal variant="slide" delay={0.15}>
                <ul className="mt-6 grid grid-cols-2 gap-2">
                  {product.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-[13px] text-foreground/80"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check className="h-3 w-3" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {/* CTA buttons */}
            <Reveal variant="fade" delay={0.18}>
              <div className="mt-8 flex flex-col gap-3">
                <a
                  id="pdp-cta"
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-[54px] items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] px-8 text-[15px] font-semibold text-white shadow-[0_8px_24px_-6px_rgba(37,211,102,0.5)] transition hover:bg-[#22c55e] hover:shadow-[0_12px_32px_-8px_rgba(37,211,102,0.6)]"
                >
                  <MessageCircle className="h-5 w-5" />
                  Order on WhatsApp
                </a>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={telUrl(BRAND.phones.primary)}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-card text-[14px] font-semibold text-foreground transition hover:border-foreground/20 hover:bg-accent"
                  >
                    <Phone className="h-4 w-4" />
                    Call to order
                  </a>
                  <a
                    href={dealerWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-card text-[14px] font-semibold text-foreground transition hover:border-foreground/20 hover:bg-accent"
                  >
                    Dealer inquiry
                  </a>
                </div>
              </div>
            </Reveal>

            {/* Wishlist / Share / Compare */}
            <Reveal variant="fade" delay={0.2}>
              <div className="mt-4 flex items-center gap-2 border-t border-border/40 pt-4">
                <button className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[12px] font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground">
                  <Heart className="h-4 w-4" /> Wishlist
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[12px] font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground">
                  <GitCompareArrows className="h-4 w-4" /> Compare
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[12px] font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground">
                  <Share2 className="h-4 w-4" /> Share
                </button>
              </div>
            </Reveal>

            {/* Trust strip */}
            <Reveal variant="fade" delay={0.22}>
              <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl border border-border/50 bg-card/60 p-4">
                {[
                  { icon: Truck, label: "Delivered across Pakistan" },
                  { icon: Shield, label: "Genuine products only" },
                  { icon: Star, label: "Real customer support" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-2 text-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/8">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-[11px] leading-snug text-muted-foreground">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Key Benefits ───────────────────────────────────────────── */}
      {detail?.whyBuy && detail.whyBuy.length > 0 && (
        <section className="border-t border-border/40 bg-background py-20 md:py-28">
          <Container>
            <Reveal variant="fade">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Why it works
              </p>
            </Reveal>
            <Reveal variant="mask" delay={0.04}>
              <h2 className="mt-3 max-w-lg font-heading text-[clamp(1.6rem,2.8vw,2.25rem)] font-semibold tracking-tight text-foreground">
                Engineered for the moments that matter.
              </h2>
            </Reveal>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {detail.whyBuy.map((pt, i) => {
                const Icon = getIcon(pt.icon);
                return (
                  <Reveal key={i} variant="scale" delay={i * 0.06}>
                    <div className="group rounded-2xl border border-border/50 bg-card p-6 transition hover:border-primary/20 hover:shadow-[0_8px_32px_-8px_rgba(11,107,203,0.12)]">
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/8 transition group-hover:bg-primary/12">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="mb-2 font-heading text-[15px] font-semibold text-foreground">
                        {pt.headline}
                      </h3>
                      <p className="text-[13px] leading-relaxed text-muted-foreground">
                        {pt.body}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* ── Lifestyle Gallery ──────────────────────────────────────── */}
      {detail?.useCases && detail.useCases.length > 0 && (
        <section className="overflow-hidden bg-[#0d1526] py-20">
          <Container>
            <Reveal variant="fade">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/40">
                In the field
              </p>
            </Reveal>
            <Reveal variant="mask" delay={0.04}>
              <h2 className="mt-3 font-heading text-[clamp(1.6rem,2.8vw,2.25rem)] font-semibold tracking-tight text-white">
                Made for every moment.
              </h2>
            </Reveal>
          </Container>

          <div className="mt-10 grid gap-1 px-4 sm:grid-cols-2 lg:grid-cols-4">
            {detail.useCases.map((uc, i) => (
              <Reveal key={i} variant="scale" delay={i * 0.05}>
                <div className="group relative aspect-[3/4] overflow-hidden rounded-2xl">
                  {uc.scene ? (
                    <Image
                      src={uc.scene}
                      alt={uc.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="h-full w-full bg-white/5" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="font-heading text-[15px] font-semibold text-white">
                      {uc.title}
                    </p>
                    <p className="mt-1 text-[12px] leading-snug text-white/65">
                      {uc.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ── Specifications ─────────────────────────────────────────── */}
      {detail?.specGroups && detail.specGroups.length > 0 && (
        <section className="border-t border-border/40 bg-background py-20 md:py-28">
          <Container>
            <Reveal variant="fade">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Specifications
              </p>
            </Reveal>
            <Reveal variant="mask" delay={0.04}>
              <h2 className="mt-3 font-heading text-[clamp(1.6rem,2.8vw,2.25rem)] font-semibold tracking-tight text-foreground">
                What&apos;s under the hood.
              </h2>
            </Reveal>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {detail.specGroups.map((group, gi) => (
                <Reveal key={gi} variant="slide" delay={gi * 0.06}>
                  <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
                    <div className="border-b border-border/50 bg-accent/40 px-6 py-4">
                      <p className="font-heading text-[13px] font-semibold uppercase tracking-[0.14em] text-foreground/70">
                        {group.title}
                      </p>
                    </div>
                    <div className="divide-y divide-border/40">
                      {group.items.map((item) => (
                        <div key={item.label} className="flex items-center justify-between px-6 py-3.5">
                          <span className="text-[13px] text-muted-foreground">{item.label}</span>
                          <span className="text-right text-[13px] font-medium text-foreground">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ── Why this product (editorial) ───────────────────────────── */}
      {detail?.editorial && (
        <section className="overflow-hidden bg-[#0d1526] py-20 md:py-28">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <Reveal variant="fade">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/40">
                  The honest story
                </p>
              </Reveal>
              <Reveal variant="mask" delay={0.05}>
                <blockquote className="mt-6 font-heading text-[clamp(1.4rem,2.5vw,2rem)] font-medium leading-[1.45] tracking-[-0.02em] text-white">
                  &ldquo;{detail.editorial}&rdquo;
                </blockquote>
              </Reveal>
              <Reveal variant="fade" delay={0.1}>
                <p className="mt-8 text-[13px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  HANIA Electronics · Karachi
                </p>
              </Reveal>
            </div>
          </Container>
        </section>
      )}

      {/* ── Product FAQ ────────────────────────────────────────────── */}
      {detail?.faqs && detail.faqs.length > 0 && (
        <section className="border-t border-border/40 bg-background py-20 md:py-24">
          <Container>
            <div className="mx-auto max-w-2xl">
              <Reveal variant="fade">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  Questions
                </p>
              </Reveal>
              <Reveal variant="mask" delay={0.04}>
                <h2 className="mt-3 font-heading text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-tight text-foreground">
                  Everything you need to know.
                </h2>
              </Reveal>

              <div className="mt-10 divide-y divide-border/50">
                {detail.faqs.map((faq, i) => (
                  <FaqItem key={i} question={faq.question} answer={faq.answer} delay={i * 0.04} />
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ── Related Products ───────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="border-t border-border/40 bg-accent/30 py-20 md:py-28">
          <Container>
            <Reveal variant="fade">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                You might also like
              </p>
            </Reveal>
            <Reveal variant="mask" delay={0.04}>
              <h2 className="mt-3 font-heading text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-tight text-foreground">
                More from {catLabel}.
              </h2>
            </Reveal>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p, i) => (
                <Reveal key={p.id} variant="scale" delay={i * 0.05}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ── Final WhatsApp CTA ─────────────────────────────────────── */}
      <section className="overflow-hidden bg-[#05070c] py-20 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 55% at 30% 50%, rgba(34,211,238,0.06), transparent 55%), radial-gradient(ellipse 40% 45% at 75% 50%, rgba(245,197,122,0.05), transparent 50%)",
          }}
        />
        <Container className="relative">
          <div className="mx-auto max-w-2xl text-center">
            <Reveal variant="fade">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/35">
                Ready to order?
              </p>
            </Reveal>
            <Reveal variant="mask" delay={0.05}>
              <h2 className="mt-4 font-heading text-[clamp(1.6rem,3vw,2.5rem)] font-semibold leading-tight tracking-tight">
                {product.name}
              </h2>
            </Reveal>
            <Reveal variant="fade" delay={0.08}>
              <p className="mt-3 font-heading text-3xl font-bold text-primary-glow">
                {formatPKR(product.pricePkr)}
              </p>
            </Reveal>
            <Reveal variant="fade" delay={0.1}>
              <p className="mt-4 text-base text-white/55">
                Genuine product. Delivered across Pakistan in 2–5 days.
              </p>
            </Reveal>
            <Reveal variant="scale" delay={0.13}>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-10 text-[16px] font-semibold text-white shadow-[0_8px_32px_-6px_rgba(37,211,102,0.5)] transition hover:bg-[#22c55e] sm:w-auto"
                >
                  <MessageCircle className="h-5 w-5" />
                  Order on WhatsApp
                </a>
                <a
                  href={telUrl(BRAND.phones.primary)}
                  className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/8 px-10 text-[16px] font-semibold text-white backdrop-blur-md transition hover:bg-white/12 sm:w-auto"
                >
                  <Phone className="h-5 w-5" />
                  {BRAND.phones.primaryDisplay}
                </a>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </main>
  );
}
