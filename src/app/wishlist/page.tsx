"use client";

import * as React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { CommerceProductCard } from "@/features/shop/commerce-product-card";
import { useWishlist } from "@/features/wishlist/store";
import { useStorefrontCatalog } from "@/components/layout/storefront-shell";

export default function WishlistPage() {
  const { ids, clear } = useWishlist();
  const { products } = useStorefrontCatalog();
  const wished = products.filter((p) => ids.includes(p.id));

  return (
    <div className="bg-[#FAFBFD] py-8 sm:py-12 md:py-14">
      <Container>
        <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
          <div>
            <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              Wishlist
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {wished.length
                ? `${wished.length} saved item${wished.length === 1 ? "" : "s"} on this device`
                : "Saved lights stay on this phone/browser"}
            </p>
          </div>
          {wished.length ? (
            <Button variant="outline" size="sm" onClick={clear}>
              Clear all
            </Button>
          ) : null}
        </div>

        {wished.length === 0 ? (
          <div className="rounded-2xl border border-border bg-white p-8 text-center shadow-sm sm:p-12">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EEF2F7] text-primary">
              <Heart className="h-6 w-6" />
            </span>
            <p className="mt-4 font-heading text-lg font-semibold">
              No saved items yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Tap the heart on any product to save it here.
            </p>
            <Button asChild className="mt-5">
              <Link href="/shop">Browse shop</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4 md:gap-5">
            {wished.map((p) => (
              <CommerceProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
