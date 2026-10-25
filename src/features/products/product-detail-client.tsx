"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Minus, Plus, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatPKR } from "@/lib/money";
import { productWhatsAppMessage, whatsappUrl } from "@/lib/brand";
import {
  getComparePrice,
  getDiscountPercent,
  getEffectivePrice,
  type Product,
} from "@/domain/types";
import { useCart } from "@/features/cart/store";
import { useWishlist } from "@/features/wishlist/store";
import { CommerceProductCard } from "@/features/shop/commerce-product-card";
import { cn } from "@/lib/utils";

const RECENT_KEY = "hania-recently-viewed";

export function ProductDetailClient({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const wishlist = useWishlist();
  const [qty, setQty] = React.useState(1);
  const [active, setActive] = React.useState(0);
  const images = [...product.images].sort((a, b) => a.sortOrder - b.sortOrder);
  const price = getEffectivePrice(product);
  const compare = getComparePrice(product);
  const discount = getDiscountPercent(product);
  const wished = wishlist.has(product.id);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      const ids: string[] = raw ? JSON.parse(raw) : [];
      const next = [product.id, ...ids.filter((id) => id !== product.id)].slice(
        0,
        8,
      );
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, [product.id]);

  return (
    <div className="bg-[#FAFBFD]">
      <div className="mx-auto grid w-full min-w-0 max-w-6xl gap-8 px-4 py-8 pb-28 sm:px-6 md:grid-cols-2 md:gap-12 md:px-8 md:py-14 md:pb-14">
        <div className="min-w-0">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-white">
            {images[active] ? (
              <Image
                src={images[active].url}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width:768px) 100%, 50vw"
              />
            ) : null}
          </div>
          {images.length > 1 ? (
            <div className="mt-3 flex w-full max-w-full gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setActive(i)}
                  className={cn(
                    "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border",
                    i === active ? "border-primary" : "border-border",
                  )}
                >
                  <Image src={img.url} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="min-w-0">
          <nav className="mb-4 break-words text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            {" / "}
            <Link href="/shop" className="hover:text-primary">
              Shop
            </Link>
            {" / "}
            <span className="text-foreground">{product.name}</span>
          </nav>

          <h1 className="break-words font-heading text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
            {product.name}
          </h1>
          <p className="mt-2 break-all text-sm text-muted-foreground">
            SKU: {product.sku}
          </p>
          <p className="mt-4 break-words text-sm leading-relaxed text-foreground/80">
            {product.shortDescription}
          </p>

          <div className="mt-6 flex flex-wrap items-end gap-x-3 gap-y-1">
            <p className="font-heading text-3xl font-semibold">
              {formatPKR(price)}
            </p>
            {compare ? (
              <p className="pb-1 text-muted-foreground line-through">
                {formatPKR(compare)}
              </p>
            ) : null}
            {discount ? (
              <span className="mb-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                {discount}% OFF
              </span>
            ) : null}
          </div>

          <p className="mt-2 text-sm">
            {product.stockStatus === "in_stock" ? (
              <span className="text-emerald-600">In stock</span>
            ) : product.stockStatus === "preorder" ? (
              <span className="text-amber-600">Preorder</span>
            ) : (
              <span className="text-destructive">Out of stock</span>
            )}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-xl border border-border bg-white">
              <button
                type="button"
                className="px-3 py-2"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-8 text-center text-sm font-medium">{qty}</span>
              <button
                type="button"
                className="px-3 py-2"
                onClick={() => setQty((q) => q + 1)}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <Button
              size="lg"
              disabled={product.stockStatus === "out_of_stock"}
              onClick={() => {
                addItem(product.id, qty);
                toast.success("Added to cart");
              }}
            >
              Add to cart
            </Button>
            <Button
              size="lg"
              variant="outline"
              disabled={product.stockStatus === "out_of_stock"}
              onClick={() => {
                addItem(product.id, qty);
                router.push("/checkout");
              }}
            >
              Buy now
            </Button>
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
                "flex h-11 w-11 items-center justify-center rounded-xl border bg-white",
                wished && "border-primary text-primary",
              )}
            >
              <Heart className={cn("h-4 w-4", wished && "fill-current")} />
            </button>
          </div>

          <Button variant="whatsapp" className="mt-3 w-full sm:w-auto" asChild>
            <a
              href={whatsappUrl(productWhatsAppMessage(product.name, price))}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4" />
              Order on WhatsApp
            </a>
          </Button>

          {product.features.length ? (
            <ul className="mt-8 space-y-2 text-sm">
              {product.features.map((f) => (
                <li key={f} className="flex min-w-0 gap-2 break-words">
                  <span className="text-primary">•</span>
                  {f}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-8 prose prose-sm max-w-none text-foreground/80">
            <p>{product.description}</p>
          </div>

          {Object.keys(product.specifications).length ? (
            <dl className="mt-8 grid gap-2 rounded-2xl border border-border bg-white p-4 text-sm sm:grid-cols-2">
              {Object.entries(product.specifications).map(([k, v]) => (
                <div key={k} className="grid min-w-0 grid-cols-[minmax(0,40%)_minmax(0,1fr)] gap-3 border-b border-border/60 py-2">
                  <dt className="break-words text-muted-foreground">{k}</dt>
                  <dd className="break-words font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </div>

      {/* Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white p-3 md:hidden">
        <div className="mx-auto flex w-full min-w-0 max-w-6xl gap-2">
          <Button
            className="min-w-0 flex-1 overflow-hidden px-3"
            disabled={product.stockStatus === "out_of_stock"}
            onClick={() => {
              addItem(product.id, qty);
              toast.success("Added to cart");
            }}
          >
            <span className="truncate">Add · {formatPKR(price)}</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              addItem(product.id, qty);
              router.push("/checkout");
            }}
          >
            Buy
          </Button>
        </div>
      </div>

      {related.length ? (
        <section className="border-t border-border bg-white py-12">
          <div className="mx-auto w-full min-w-0 max-w-6xl px-4 md:px-8">
            <h2 className="mb-6 font-heading text-2xl font-semibold">
              Related products
            </h2>
            <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
              {related.map((p) => (
                <CommerceProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
