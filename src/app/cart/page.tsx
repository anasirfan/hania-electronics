"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
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

  return (
    <div className="bg-[#FAFBFD] py-10 md:py-14">
      <Container>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Cart
        </h1>
        {lines.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-border bg-white p-8 text-center">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Button asChild className="mt-4">
              <Link href="/shop">Continue shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              {lines.map(({ item, product }) => {
                const image = getPrimaryImage(product);
                const price = getEffectivePrice(product);
                return (
                  <div
                    key={item.productId}
                    className="flex gap-4 rounded-2xl border border-border bg-white p-4"
                  >
                    <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-accent">
                      {image ? (
                        <Image src={image} alt="" fill className="object-cover" />
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <Link
                        href={`/product/${product.slug}`}
                        className="font-medium hover:text-primary"
                      >
                        {product.name}
                      </Link>
                      <p className="text-sm font-semibold">{formatPKR(price)}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="inline-flex items-center rounded-lg border">
                          <button
                            type="button"
                            className="px-2 py-1"
                            onClick={() =>
                              setQuantity(item.productId, item.quantity - 1)
                            }
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="px-2 text-sm">{item.quantity}</span>
                          <button
                            type="button"
                            className="px-2 py-1"
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
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="font-semibold">
                      {formatPKR(price * item.quantity)}
                    </p>
                  </div>
                );
              })}
            </div>
            <aside className="h-fit rounded-2xl border border-border bg-white p-5">
              <h2 className="font-heading text-lg font-semibold">Summary</h2>
              <div className="mt-4 flex justify-between text-sm">
                <span>Subtotal</span>
                <span className="font-semibold">{formatPKR(subtotal)}</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Shipping calculated at checkout. Cash on delivery available.
              </p>
              <Button asChild className="mt-5 w-full">
                <Link href="/checkout">Proceed to checkout</Link>
              </Button>
            </aside>
          </div>
        )}
      </Container>
    </div>
  );
}
