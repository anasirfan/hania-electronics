"use client";

import * as React from "react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { ProductCard } from "@/features/products/product-card";
import { products } from "@/data/catalog/products";
import { cn } from "@/lib/utils";
import type { Purpose } from "@/features/products/types";

const environments: {
  id: Purpose;
  name: string;
  description: string;
  accent: string;
}[] = [
  {
    id: "home",
    name: "Home",
    description: "Everyday lighting that feels like part of the room.",
    accent: "rgba(245,197,122,0.18)",
  },
  {
    id: "camping",
    name: "Camping",
    description: "Portable power for nights far from the grid.",
    accent: "rgba(34,211,238,0.15)",
  },
  {
    id: "office",
    name: "Office",
    description: "Clean, reliable light for workstations and shops.",
    accent: "rgba(99,179,237,0.14)",
  },
  {
    id: "emergency",
    name: "Emergency",
    description: "Backup light the moment the grid goes down.",
    accent: "rgba(252,129,74,0.15)",
  },
];

export function ShopByPurposeSection() {
  const [purpose, setPurpose] = React.useState<Purpose>("home");
  const active = environments.find((e) => e.id === purpose)!;
  const filtered = products.filter((p) => p.purposes.includes(purpose)).slice(0, 3);

  return (
    <section id="purpose" className="relative py-20 md:py-28">
      <Container>
        <div className="mb-10 max-w-xl">
          <Reveal variant="fade">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Shop by Purpose
            </p>
          </Reveal>
          <Reveal variant="mask">
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
              Start with how you use light
            </h2>
          </Reveal>
        </div>

        <Reveal variant="fade">
          <div className="mb-6 flex flex-wrap gap-2">
            {environments.map((env) => (
              <button
                key={env.id}
                type="button"
                onClick={() => setPurpose(env.id)}
                className={cn(
                  "rounded-full px-5 py-2.5 text-sm font-medium transition",
                  purpose === env.id
                    ? "bg-[#131f33] text-white"
                    : "bg-black/[0.04] text-foreground/70 hover:bg-black/[0.07]",
                )}
              >
                {env.name}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="relative min-h-[460px] overflow-hidden rounded-[28px] bg-[#0d1526] md:min-h-[520px]">
          <div
            aria-hidden
            key={active.id}
            className="absolute inset-0 transition-all duration-700"
            style={{
              background: `radial-gradient(ellipse 80% 60% at 80% 0%, ${active.accent}, transparent 55%), radial-gradient(ellipse 60% 50% at 10% 100%, ${active.accent}, transparent 50%), linear-gradient(160deg,#060a14 0%,#0d1526 55%,#060a14 100%)`,
            }}
          />

          <div className="relative z-10 flex min-h-[460px] flex-col p-6 md:min-h-[520px] md:p-10">
            <div className="max-w-md">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-glow">
                {active.name}
              </p>
              <h3 className="mt-3 font-heading text-2xl font-semibold text-white sm:text-3xl">
                {active.description}
              </h3>
            </div>

            {filtered.length > 0 ? (
              <div
                className="mt-8 grid gap-4"
                style={{
                  gridTemplateColumns: `repeat(${filtered.length}, 1fr)`,
                }}
              >
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className="mt-10 text-white/60">
                More products for this purpose coming soon.
              </p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
