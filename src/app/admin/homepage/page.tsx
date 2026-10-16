"use client";

import * as React from "react";
import { toast } from "sonner";
import { Plus, X, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleSwitch } from "@/features/admin/toggle-switch";
import {
  CategoryPicker,
  ProductPicker,
  Thumb,
} from "@/features/admin/product-picker";
import { formatPKR } from "@/lib/utils";
import {
  getEffectivePrice,
  getPrimaryImage,
  type Category,
  type HomepageConfig,
  type Product,
} from "@/domain/types";

type ProductSlot =
  | "featuredProductIds"
  | "bestSellerProductIds"
  | "newArrivalProductIds"
  | "saleProductIds";

const PRODUCT_SLOTS: { key: ProductSlot; label: string; hint: string }[] = [
  {
    key: "featuredProductIds",
    label: "Featured products",
    hint: "Hero picks shown in the Featured section.",
  },
  {
    key: "bestSellerProductIds",
    label: "Popular picks",
    hint: "Top selling / best sellers row.",
  },
  {
    key: "newArrivalProductIds",
    label: "New arrivals",
    hint: "Recently added products.",
  },
  {
    key: "saleProductIds",
    label: "Sale products",
    hint: "Discounted items in the Sale row.",
  },
];

const SECTION_META: Record<
  keyof HomepageConfig["sections"],
  { label: string; hint: string }
> = {
  categories: { label: "Categories", hint: "Featured category tiles" },
  featured: { label: "Featured products", hint: "Hero product picks" },
  bestSellers: { label: "Popular picks", hint: "Top selling row" },
  newArrivals: { label: "New arrivals", hint: "Latest products row" },
  sale: { label: "Sale", hint: "Discounted products row" },
  marketingBanner: { label: "Marketing banner", hint: "Mid-page promo banner" },
  trust: { label: "Trust strip", hint: "COD, delivery, support badges" },
  newsletter: { label: "Newsletter", hint: "Email signup block" },
};

function move<T>(list: T[], index: number, dir: -1 | 1): T[] {
  const target = index + dir;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  const tmp = next[index];
  next[index] = next[target];
  next[target] = tmp;
  return next;
}

function SlotCard({
  title,
  hint,
  count,
  onAdd,
  children,
}: {
  title: string;
  hint: string;
  count: number;
  onAdd: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div className="min-w-0">
          <h2 className="font-heading text-base font-semibold">
            {title}
            <span className="ml-2 rounded-full bg-foreground/5 px-2 py-0.5 text-xs font-semibold text-muted-foreground">
              {count}
            </span>
          </h2>
          <p className="truncate text-xs text-muted-foreground">{hint}</p>
        </div>
        <Button type="button" size="sm" onClick={onAdd} className="shrink-0 gap-1.5">
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </header>
      <div className="p-2">{children}</div>
    </section>
  );
}

function EmptySlot({ onAdd, what }: { onAdd: () => void; what: string }) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border px-4 py-8 text-sm text-muted-foreground transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-current">
        <Plus className="h-4 w-4" />
      </span>
      Add {what}
    </button>
  );
}

function RowActions({
  index,
  length,
  onMove,
  onRemove,
}: {
  index: number;
  length: number;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <span className="flex shrink-0 items-center gap-0.5 opacity-60 transition group-hover:opacity-100">
      <button
        type="button"
        disabled={index === 0}
        onClick={() => onMove(-1)}
        className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30"
        aria-label="Move up"
      >
        <ArrowUp className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        disabled={index === length - 1}
        onClick={() => onMove(1)}
        className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30"
        aria-label="Move down"
      >
        <ArrowDown className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        aria-label="Remove"
      >
        <X className="h-4 w-4" />
      </button>
    </span>
  );
}

export default function AdminHomepagePage() {
  const [homepage, setHomepage] = React.useState<HomepageConfig | null>(null);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [saving, setSaving] = React.useState(false);
  const [picker, setPicker] = React.useState<ProductSlot | "categories" | null>(
    null,
  );

  React.useEffect(() => {
    void Promise.all([
      fetch("/api/admin/homepage").then((r) => r.json()),
      fetch("/api/admin/products").then((r) => r.json()),
      fetch("/api/admin/categories").then((r) => r.json()),
    ])
      .then(([h, p, c]) => {
        setHomepage(h.homepage);
        setProducts(p.products ?? []);
        setCategories(c.categories ?? []);
      })
      .catch(() => toast.error("Failed to load homepage settings"));
  }, []);

  async function save() {
    if (!homepage) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/homepage", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(homepage),
      });
      if (!res.ok) {
        toast.error("Save failed");
        return;
      }
      const data = await res.json();
      setHomepage(data.homepage);
      toast.success("Homepage saved");
    } finally {
      setSaving(false);
    }
  }

  if (!homepage) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  const productById = new Map(products.map((p) => [p.id, p]));
  const categoryById = new Map(categories.map((c) => [c.id, c]));
  const h = homepage;

  function setSlot(key: ProductSlot | "featuredCategoryIds", ids: string[]) {
    setHomepage({ ...h, [key]: ids });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Homepage
          </h1>
          <p className="text-sm text-muted-foreground">
            Choose what shows on the homepage and in which order.
          </p>
        </div>
        <Button onClick={() => void save()} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>

      {/* Section visibility */}
      <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <h2 className="font-heading text-base font-semibold">Sections</h2>
        <p className="mb-4 text-xs text-muted-foreground">
          Turn homepage sections on or off.
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {(
            Object.keys(SECTION_META) as Array<keyof HomepageConfig["sections"]>
          ).map((key) => (
            <ToggleSwitch
              key={key}
              label={SECTION_META[key].label}
              hint={SECTION_META[key].hint}
              checked={Boolean(h.sections[key])}
              onChange={(v) =>
                setHomepage({ ...h, sections: { ...h.sections, [key]: v } })
              }
            />
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Featured categories */}
        <SlotCard
          title="Featured categories"
          hint="Category tiles shown near the top of the homepage."
          count={h.featuredCategoryIds.length}
          onAdd={() => setPicker("categories")}
        >
          {h.featuredCategoryIds.length === 0 ? (
            <EmptySlot what="categories" onAdd={() => setPicker("categories")} />
          ) : (
            <ul className="divide-y divide-border/60">
              {h.featuredCategoryIds.map((id, i) => {
                const c = categoryById.get(id);
                return (
                  <li key={id} className="group flex items-center gap-3 px-2 py-2">
                    <Thumb src={c?.image ?? null} alt={c?.name ?? ""} size={40} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {c?.name ?? "Unknown category"}
                      </span>
                      {c && !c.active && (
                        <span className="text-xs text-amber-700">Inactive</span>
                      )}
                    </span>
                    <RowActions
                      index={i}
                      length={h.featuredCategoryIds.length}
                      onMove={(d) =>
                        setSlot("featuredCategoryIds", move(h.featuredCategoryIds, i, d))
                      }
                      onRemove={() =>
                        setSlot(
                          "featuredCategoryIds",
                          h.featuredCategoryIds.filter((x) => x !== id),
                        )
                      }
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </SlotCard>

        {/* Product slots */}
        {PRODUCT_SLOTS.map((slot) => {
          const ids = h[slot.key];
          return (
            <SlotCard
              key={slot.key}
              title={slot.label}
              hint={slot.hint}
              count={ids.length}
              onAdd={() => setPicker(slot.key)}
            >
              {ids.length === 0 ? (
                <EmptySlot what="products" onAdd={() => setPicker(slot.key)} />
              ) : (
                <ul className="divide-y divide-border/60">
                  {ids.map((id, i) => {
                    const p = productById.get(id);
                    const cat = p ? categoryById.get(p.categoryId) : undefined;
                    return (
                      <li key={id} className="group flex items-center gap-3 px-2 py-2">
                        <Thumb src={p ? getPrimaryImage(p) : null} alt={p?.name ?? ""} size={44} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">
                            {p?.name ?? "Unknown product"}
                          </span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {p ? (
                              <>
                                {cat?.name ?? "—"} · {formatPKR(getEffectivePrice(p))}
                                {!p.published && (
                                  <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-amber-700">
                                    Draft
                                  </span>
                                )}
                              </>
                            ) : (
                              "Product no longer exists"
                            )}
                          </span>
                        </span>
                        <RowActions
                          index={i}
                          length={ids.length}
                          onMove={(d) => setSlot(slot.key, move(ids, i, d))}
                          onRemove={() =>
                            setSlot(slot.key, ids.filter((x) => x !== id))
                          }
                        />
                      </li>
                    );
                  })}
                </ul>
              )}
            </SlotCard>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Button onClick={() => void save()} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>

      {/* Pickers */}
      <CategoryPicker
        open={picker === "categories"}
        onOpenChange={(o) => !o && setPicker(null)}
        categories={categories}
        selected={h.featuredCategoryIds}
        onChange={(ids) => setSlot("featuredCategoryIds", ids)}
      />
      {PRODUCT_SLOTS.map((slot) => (
        <ProductPicker
          key={slot.key}
          open={picker === slot.key}
          onOpenChange={(o) => !o && setPicker(null)}
          title={`Add to ${slot.label}`}
          products={products}
          categories={categories}
          selected={h[slot.key]}
          onChange={(ids) => setSlot(slot.key, ids)}
        />
      ))}
    </div>
  );
}
