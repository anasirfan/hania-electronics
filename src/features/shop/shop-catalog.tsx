"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Category, Product } from "@/domain/types";
import {
  getEffectivePrice,
} from "@/domain/types";
import { CommerceProductCard } from "@/features/shop/commerce-product-card";

type SortKey = "featured" | "price-asc" | "price-desc" | "newest" | "name";

export function ShopCatalog({
  products,
  categories,
  activeCategorySlug,
}: {
  products: Product[];
  categories: Category[];
  activeCategorySlug?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const min = Number(searchParams.get("min") ?? 0);
  const max = Number(searchParams.get("max") ?? 0);
  const inStock = searchParams.get("inStock") === "1";
  const onSale = searchParams.get("sale") === "1";
  const featured = searchParams.get("featured") === "1";
  const sort = (searchParams.get("sort") as SortKey) || "featured";

  function updateParams(patch: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([k, v]) => {
      if (v == null || v === "" || v === "0") next.delete(k);
      else next.set(k, v);
    });
    router.push(`${pathname}?${next.toString()}`);
  }

  let filtered = [...products];
  if (activeCategorySlug) {
    const cat = categories.find((c) => c.slug === activeCategorySlug);
    if (cat) filtered = filtered.filter((p) => p.categoryId === cat.id);
  }
  if (min > 0) filtered = filtered.filter((p) => getEffectivePrice(p) >= min);
  if (max > 0) filtered = filtered.filter((p) => getEffectivePrice(p) <= max);
  if (inStock)
    filtered = filtered.filter((p) => p.stockStatus === "in_stock");
  if (onSale)
    filtered = filtered.filter(
      (p) => p.salePrice != null && p.salePrice > 0,
    );
  if (featured) filtered = filtered.filter((p) => p.featured);

  filtered.sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return getEffectivePrice(a) - getEffectivePrice(b);
      case "price-desc":
        return getEffectivePrice(b) - getEffectivePrice(a);
      case "newest":
        return b.createdAt.localeCompare(a.createdAt);
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return Number(b.featured) - Number(a.featured);
    }
  });

  const Filters = (
    <div className="space-y-5 text-sm">
      <div>
        <p className="mb-2 font-medium">Categories</p>
        <div className="space-y-1">
          <Link
            href="/shop"
            className={!activeCategorySlug ? "text-primary" : "text-muted-foreground"}
          >
            All products
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/shop/${c.slug}`}
              className={
                activeCategorySlug === c.slug
                  ? "block text-primary"
                  : "block text-muted-foreground hover:text-foreground"
              }
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 font-medium">Price (PKR)</p>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={min || ""}
            className="h-9 w-full rounded-md border px-2"
            onBlur={(e) => updateParams({ min: e.target.value || null })}
          />
          <input
            type="number"
            placeholder="Max"
            defaultValue={max || ""}
            className="h-9 w-full rounded-md border px-2"
            onBlur={(e) => updateParams({ max: e.target.value || null })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) =>
              updateParams({ inStock: e.target.checked ? "1" : null })
            }
          />
          In stock
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={onSale}
            onChange={(e) =>
              updateParams({ sale: e.target.checked ? "1" : null })
            }
          />
          On sale
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) =>
              updateParams({ featured: e.target.checked ? "1" : null })
            }
          />
          Featured
        </label>
      </div>
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      <aside className="hidden lg:block">{Filters}</aside>

      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {filtered.length} products
          </p>
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">{Filters}</div>
              </SheetContent>
            </Sheet>
            <select
              className="h-9 rounded-md border bg-white px-3 text-sm"
              value={sort}
              onChange={(e) => updateParams({ sort: e.target.value })}
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
          {filtered.map((p) => (
            <CommerceProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
