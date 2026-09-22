import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { CommerceProductCard } from "@/features/shop/commerce-product-card";
import type { Category, Product } from "@/domain/types";

export function ShopByCategorySection({
  categories,
}: {
  categories: Category[];
}) {
  if (!categories.length) return null;
  return (
    <section className="py-10 sm:py-14 md:py-16">
      <Container>
        <div className="mb-5 flex items-end justify-between gap-4 sm:mb-8">
          <div>
            <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">
              Shop by Category
            </h2>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Metal, flash, and solar lighting — all from HANIA.
            </p>
          </div>
          <Link href="/shop" className="text-xs font-medium text-primary sm:text-sm">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/shop/${c.slug}`}
              className="group relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#0B1220] sm:aspect-[4/3]"
            >
              {c.image ? (
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  className="object-cover opacity-85 transition duration-500 group-hover:scale-105 group-hover:opacity-95"
                  sizes="(max-width:640px) 100vw, 33vw"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <h3 className="font-heading text-lg font-semibold text-white sm:text-xl">
                  {c.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-white/70">
                  {c.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function ProductRail({
  title,
  subtitle,
  products,
  href = "/shop",
}: {
  title: string;
  subtitle?: string;
  products: Product[];
  href?: string;
}) {
  if (!products.length) return null;
  return (
    <section className="py-10 sm:py-12 md:py-14">
      <Container>
        <div className="mb-5 flex items-end justify-between gap-4 sm:mb-8">
          <div>
            <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{subtitle}</p>
            ) : null}
          </div>
          <Link href={href} className="text-xs font-medium text-primary sm:text-sm">
            Shop all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4 md:gap-5">
          {products.slice(0, 8).map((p) => (
            <CommerceProductCard key={p.id} product={p} />
          ))}
        </div>
      </Container>
    </section>
  );
}

export function TrustBenefitsSection() {
  const items = [
    {
      title: "Pakistan-wide delivery",
      text: "Reliable shipping to major cities and towns.",
    },
    {
      title: "Cash on delivery",
      text: "Pay when your order arrives at your door.",
    },
    {
      title: "Warranty support",
      text: "Genuine products with after-sales assistance.",
    },
    {
      title: "Wholesale ready",
      text: "Dealer pricing available for bulk partners.",
    },
  ];
  return (
    <section className="border-y border-border bg-white py-12">
      <Container>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.title}>
              <h3 className="font-heading text-base font-semibold">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function MarketingBannerSection({
  title,
  subtitle,
  href,
  image,
}: {
  title: string;
  subtitle: string;
  href: string;
  image?: string | null;
}) {
  return (
    <section className="py-12">
      <Container>
        <Link
          href={href}
          className="relative flex min-h-[220px] items-end overflow-hidden rounded-2xl bg-[#0B6BCB] p-8 text-white md:min-h-[280px]"
        >
          {image ? (
            <Image
              src={image}
              alt=""
              fill
              className="object-cover opacity-40"
            />
          ) : null}
          <div className="relative z-[1] max-w-lg">
            <h2 className="font-heading text-2xl font-semibold md:text-3xl">
              {title}
            </h2>
            <p className="mt-2 text-sm text-white/85">{subtitle}</p>
            <span className="mt-4 inline-block text-sm font-semibold underline">
              Explore offers
            </span>
          </div>
        </Link>
      </Container>
    </section>
  );
}
