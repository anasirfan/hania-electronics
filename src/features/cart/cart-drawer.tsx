"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { formatPKR } from "@/lib/money";
import {
  getEffectivePrice,
  getPrimaryImage,
  type Product,
} from "@/domain/types";
import { useCart } from "@/features/cart/store";

export function CartDrawer({ products }: { products: Product[] }) {
  const { items, open, setOpen, setQuantity, removeItem, count } = useCart();
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
    .filter(Boolean) as { item: { productId: string; quantity: number }; product: Product }[];

  const subtotal = lines.reduce(
    (sum, l) => sum + getEffectivePrice(l.product) * l.item.quantity,
    0,
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="flex items-center justify-between">
            Cart ({count})
            <button type="button" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </button>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto py-4">
          {lines.length === 0 ? (
            <p className="text-sm text-muted-foreground">Your cart is empty.</p>
          ) : (
            lines.map(({ item, product }) => {
              const image = getPrimaryImage(product);
              const price = getEffectivePrice(product);
              return (
                <div key={item.productId} className="flex gap-3">
                  <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-accent">
                    {image ? (
                      <Image src={image} alt="" fill className="object-cover" />
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <Link
                      href={`/product/${product.slug}`}
                      className="text-sm font-medium hover:text-primary"
                      onClick={() => setOpen(false)}
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
                </div>
              );
            })
          )}
        </div>

        <div className="space-y-3 border-t border-border pt-4">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span className="font-semibold">{formatPKR(subtotal)}</span>
          </div>
          <Button asChild className="w-full" disabled={!lines.length}>
            <Link href="/cart" onClick={() => setOpen(false)}>
              View cart
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full"
            disabled={!lines.length}
          >
            <Link href="/checkout" onClick={() => setOpen(false)}>
              Checkout
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
