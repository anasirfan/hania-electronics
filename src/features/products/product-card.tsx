"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, GitCompareArrows, Eye, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ProductVisual } from "@/features/products/product-visual";
import { QuickView } from "@/features/products/quick-view";
import { useProductStore } from "@/features/products/store";
import type { Product } from "@/features/products/types";
import { formatPKR, cn } from "@/lib/utils";
import { productWhatsAppMessage, whatsappUrl } from "@/lib/brand";

export function ProductCard({
  product,
  className,
  large = false,
}: {
  product: Product;
  className?: string;
  large?: boolean;
}) {
  const { toggleWishlist, toggleCompare, isWishlisted, isCompared } =
    useProductStore();
  const [quickOpen, setQuickOpen] = React.useState(false);
  const wish = isWishlisted(product.id);
  const compared = isCompared(product.id);

  return (
    <>
      <article
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-border bg-card shadow-[0_4px_32px_-8px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-1 hover:border-foreground/15 hover:shadow-[0_12px_48px_-12px_rgba(34,211,238,0.12)]",
          className,
        )}
      >
        <div className="absolute left-4 top-4 z-20 flex flex-col gap-2">
          {product.badge ? (
            <Badge variant={product.badge}>{product.badge}</Badge>
          ) : null}
        </div>

        <div className="absolute right-3 top-3 z-20 flex flex-col gap-2 opacity-100 transition md:opacity-0 md:group-hover:opacity-100">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="h-9 w-9 border-white/40 bg-white/95"
                onClick={() => toggleWishlist(product.id)}
                aria-label="Wishlist"
              >
                <Heart
                  className={cn("h-4 w-4", wish && "fill-rose-500 text-rose-500")}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Wishlist</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="h-9 w-9 border-white/40 bg-white/95"
                onClick={() => toggleCompare(product.id)}
                aria-label="Compare"
              >
                <GitCompareArrows
                  className={cn("h-4 w-4", compared && "text-primary")}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Compare</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="h-9 w-9 border-white/40 bg-white/95"
                onClick={() => setQuickOpen(true)}
                aria-label="Quick view"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Quick View</TooltipContent>
          </Tooltip>
        </div>

        <Link href={`/products/${product.slug}`} tabIndex={-1} aria-hidden>
          <ProductVisual
            src={product.image}
            alt={product.name}
            size={large ? "lg" : "md"}
            className="rounded-none"
          />
        </Link>

        <div
          className={cn(
            "shrink-0 space-y-2.5 border-t border-border bg-card",
            large ? "px-6 pb-5 pt-5 md:px-7 md:pb-6 md:pt-6" : "px-5 pb-4 pt-4",
          )}
        >
          <Link href={`/products/${product.slug}`}>
            <h3
              className={cn(
                "font-heading font-semibold tracking-tight text-foreground transition hover:text-primary-glow",
                large ? "text-2xl" : "text-lg",
              )}
            >
              {product.name}
            </h3>
          </Link>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>
          <div className="flex items-center justify-between gap-3 pt-1">
            <p className="font-heading text-xl font-semibold tracking-tight">
              {formatPKR(product.pricePkr)}
            </p>
            <Button variant="whatsapp" size="sm" className="rounded-full" asChild>
              <a
                href={whatsappUrl(
                  productWhatsAppMessage(product.name, product.pricePkr),
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle /> Order
              </a>
            </Button>
          </div>
        </div>
      </article>
      <QuickView
        product={product}
        open={quickOpen}
        onOpenChange={setQuickOpen}
      />
    </>
  );
}
