"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatPKR } from "@/lib/money";
import { cn } from "@/lib/utils";
import {
  getComparePrice,
  getDiscountPercent,
  getEffectivePrice,
  getPrimaryImage,
  type Product,
} from "@/domain/types";
import { useCart } from "@/features/cart/store";
import { useWishlist } from "@/features/wishlist/store";

function badges(product: Product) {
  const list: string[] = [];
  if (product.newArrival) list.push("NEW");
  if (product.saleBadge || getDiscountPercent(product)) list.push("SALE");
  if (product.bestSeller) list.push("POPULAR");
  if (product.manualBadges.includes("HOT")) list.push("HOT");
  return list;
}

export function CommerceProductCard({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const { addItem } = useCart();
  const wishlist = useWishlist();
  const image = getPrimaryImage(product);
  const price = getEffectivePrice(product);
  const compare = getComparePrice(product);
  const discount = getDiscountPercent(product);
  const wished = wishlist.has(product.id);

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-xl border border-border/80 bg-white shadow-[0_1px_2px_rgba(11,18,32,0.04)] transition duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_12px_28px_rgba(11,18,32,0.08)] sm:rounded-2xl",
        className,
      )}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#EEF2F7] sm:aspect-[4/5]">
        <Link href={`/product/${product.slug}`} className="absolute inset-0">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.04]"
              sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
            />
          ) : null}
        </Link>

        {/* Left: status badges */}
        <div className="absolute left-2 top-2 flex max-w-[55%] flex-col gap-1 sm:left-3 sm:top-3">
          {badges(product).map((b) => (
            <span
              key={b}
              className="w-fit rounded-md bg-primary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white sm:px-2 sm:text-[10px]"
            >
              {b}
            </span>
          ))}
        </div>

        {/* Right: % OFF + wishlist */}
        <div className="absolute right-2 top-2 flex flex-col items-end gap-1.5 sm:right-3 sm:top-3 sm:gap-2">
          {discount ? (
            <span className="rounded-md bg-[#0B1220] px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-white shadow-sm sm:px-2 sm:text-[10px]">
              {discount}% OFF
            </span>
          ) : null}
          <button
            type="button"
            aria-label="Wishlist"
            onClick={() => {
              wishlist.toggle(product.id);
              toast.success(
                wished ? "Removed from wishlist" : "Added to wishlist",
              );
            }}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-white/95 shadow-sm backdrop-blur sm:h-9 sm:w-9",
              wished && "border-primary text-primary",
            )}
          >
            <Heart className={cn("h-3.5 w-3.5 sm:h-4 sm:w-4", wished && "fill-current")} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-2.5 sm:gap-3 sm:p-4">
        <div className="flex-1">
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-heading text-[13px] font-semibold leading-snug tracking-tight line-clamp-2 hover:text-primary sm:text-[15px]">
              {product.name}
            </h3>
          </Link>
          <p className="mt-1 hidden text-xs text-muted-foreground line-clamp-2 sm:block">
            {product.shortDescription}
          </p>
        </div>
        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0">
            <p className="font-heading text-[15px] font-semibold text-[#0B1220] sm:text-lg">
              {formatPKR(price)}
            </p>
            {compare ? (
              <p className="text-[10px] text-muted-foreground line-through sm:text-xs">
                {formatPKR(compare)}
              </p>
            ) : null}
          </div>
          <Button
            size="sm"
            className="h-8 shrink-0 gap-1 px-2.5 text-xs sm:h-9 sm:gap-1.5 sm:px-3 sm:text-sm"
            disabled={product.stockStatus === "out_of_stock"}
            onClick={() => {
              addItem(product.id, 1);
              toast.success("Added to cart");
            }}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span className="hidden xs:inline sm:inline">Add</span>
          </Button>
        </div>
      </div>
    </article>
  );
}
