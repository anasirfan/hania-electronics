"use client";

import * as React from "react";
import Link from "next/link";
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
    <div className="bg-[#FAFBFD] py-10 md:py-14">
      <Container>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-semibold tracking-tight">
              Wishlist
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {wished.length} saved item{wished.length === 1 ? "" : "s"}
            </p>
          </div>
          {wished.length ? (
            <Button variant="outline" size="sm" onClick={clear}>
              Clear all
            </Button>
          ) : null}
        </div>

        {wished.length === 0 ? (
          <div className="rounded-2xl border border-border bg-white p-8 text-center">
            <p className="text-muted-foreground">No wishlist items yet.</p>
            <Button asChild className="mt-4">
              <Link href="/shop">Browse shop</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {wished.map((p) => (
              <CommerceProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
