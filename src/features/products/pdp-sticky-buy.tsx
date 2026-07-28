"use client";

import * as React from "react";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { Container } from "@/components/layout/container";
import { cn, formatPKR } from "@/lib/utils";
import type { Product } from "@/features/products/types";

interface PdpStickyBuyProps {
  product: Product;
  waUrl: string;
}

export function PdpStickyBuy({ product, waUrl }: PdpStickyBuyProps) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 top-[72px] z-40 border-b border-border/50 bg-white/95 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-300",
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-full opacity-0",
      )}
    >
      <Container>
        <div className="flex h-[60px] items-center gap-4">
          {/* Thumbnail */}
          {product.image && (
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-[#0d1526]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-1"
                sizes="32px"
              />
            </div>
          )}

          {/* Name + price */}
          <div className="min-w-0 flex-1">
            <p className="truncate font-heading text-sm font-semibold leading-tight text-foreground">
              {product.name}
            </p>
            <p className="font-heading text-sm font-bold text-primary">
              {formatPKR(product.pricePkr)}
            </p>
          </div>

          {/* CTA */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#25D366] px-5 py-2 text-[13px] font-semibold text-white shadow-[0_4px_16px_-4px_rgba(37,211,102,0.5)] transition hover:bg-[#22c55e]"
          >
            <MessageCircle className="h-4 w-4" />
            Order Now
          </a>
        </div>
      </Container>
    </div>
  );
}
