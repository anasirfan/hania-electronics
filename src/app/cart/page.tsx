"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { formatPKR } from "@/lib/money";
import {
  getEffectivePrice,
  getPrimaryImage,
  type Product,
} from "@/domain/types";
import { useCart } from "@/features/cart/store";
import { useStorefrontCatalog } from "@/components/layout/storefront-shell";

export default function CartPage() {
  const { items, setQuantity, removeItem } = useCart();
  const { products } = useStorefrontCatalog();
  const byId = React.useMemo(
    () => new Map(products.map((p) => [p.id, p])),
    [products],
  );

  const lines = items
    .map((item) => {
      const product = byId.get(item.productId);
      if (!product) return null;
      return { item, product };
    })
    .filter(Boolean) as {
    item: { productId: string; quantity: number };
    product: Product;
  }[];

  const subtotal = lines.reduce(
    (sum, l) => sum + getEffectivePrice(l.product) * l.item.quantity,
    0,
  );
  const shippingPreview = subtotal >= 5000 || subtotal === 0 ? 0 : 250;

  return (
    <div className="bg-[#FAFBFD] pb-28 pt-8 sm:py-12 md:py-14">
      <Container>
        <div className="mb-6 sm:mb-8">
          <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Cart
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {lines.length
              ? `${lines.length} item${lines.length === 1 ? "" : "s"} in your cart`
              : "Your bag is empty"}
          </p>
        </div>

        {lines.length === 0 ? (
          <div className="rounded-2xl border border-border bg-white p-8 text-center shadow-sm sm:p-12">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EEF2F7] text-primary">
              <ShoppingBag className="h-6 w-6" />
            </span>
            <p className="mt-4 font-heading text-lg font-semibold">
              Nothing here yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse metal, flash, and solar lights — COD available.
            </p>
            <Button asChild className="mt-5">
              <Link href="/shop">Start shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:gap-8">
            <div className="space-y-3 sm:space-y-4">
              {lines.map(({ item, product }) => {
                const image = getPrimaryImage(product);
                const price = getEffectivePrice(product);
                return (
                  <div
                    key={item.productId}
                    className="flex gap-3 rounded-2xl border border-border bg-white p-3 shadow-sm sm:gap-4 sm:p-4"
                  >
                    <Link
                      href={`/product/${product.slug}`}
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-accent sm:h-24 sm:w-24"
                    >
                      {image ? (
                        <Image src={image} alt="" fill className="object-cover" />
                      ) : null}
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <Link
                        href={`/product/${product.slug}`}
                        className="line-clamp-2 text-sm font-medium hover:text-primary sm:text-base"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-0.5 text-sm font-semibold">
                        {formatPKR(price)}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="inline-flex items-center rounded-lg border">
                          <button
                            type="button"
                            className="px-2.5 py-1.5"
                            aria-label="Decrease quantity"
                            onClick={() =>
                              setQuantity(item.productId, item.quantity - 1)
                            }
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-7 px-1 text-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            className="px-2.5 py-1.5"
                            aria-label="Increase quantity"
                            onClick={() =>
                              setQuantity(item.productId, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          className="text-muted-foreground hover:text-destructive"
                          aria-label="Remove"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="hidden font-semibold sm:block">
                      {formatPKR(price * item.quantity)}
                    </p>
                  </div>
                );
              })}
            </div>

            <aside className="hidden h-fit rounded-2xl border border-border bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:block">
              <h2 className="font-heading text-lg font-semibold">Summary</h2>
              <div className="mt-4 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatPKR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping (est.)</span>
                  <span>
                    {shippingPreview === 0
                      ? "Free"
                      : formatPKR(shippingPreview)}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Free shipping on Rs. 5,000+. Final total at checkout.
              </p>
              <Button asChild className="mt-5 w-full">
                <Link href="/checkout">Proceed to checkout</Link>
              </Button>
              <Button asChild variant="outline" className="mt-2 w-full">
                <Link href="/shop">Continue shopping</Link>
              </Button>
            </aside>
          </div>
        )}
      </Container>

      {lines.length > 0 ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 p-3 backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-lg items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-muted-foreground">Subtotal</p>
              <p className="font-heading text-lg font-semibold">
                {formatPKR(subtotal)}
              </p>
            </div>
            <Button asChild className="flex-1">
              <Link href="/checkout">Checkout</Link>
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
