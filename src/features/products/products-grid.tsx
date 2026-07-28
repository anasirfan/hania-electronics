"use client";

import * as React from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, X, ArrowUpDown } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { ProductCard } from "@/features/products/product-card";
import type { Category, Product } from "@/features/products/types";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "name", label: "A → Z" },
];

function applySort(products: Product[], sort: string): Product[] {
  switch (sort) {
    case "price-asc":
      return [...products].sort((a, b) => a.pricePkr - b.pricePkr);
    case "price-desc":
      return [...products].sort((a, b) => b.pricePkr - a.pricePkr);
    case "name":
      return [...products].sort((a, b) => a.name.localeCompare(b.name));
    default:
      return products;
  }
}

export function ProductsGrid({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [activeCategory, setActiveCategory] = React.useState("all");
  const [sort, setSort] = React.useState("featured");
  const [query, setQuery] = React.useState("");
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const filtered = React.useMemo(() => {
    let list = products;
    if (activeCategory !== "all")
      list = list.filter((p) => p.category === activeCategory);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.includes(q),
      );
    }
    return applySort(list, sort);
  }, [products, activeCategory, sort, query]);

  const isFiltered = activeCategory !== "all" || query.trim() !== "";
  const activeCategoryLabel =
    categories.find((c) => c.id === activeCategory)?.name ?? "All Products";

  function clearFilters() {
    setActiveCategory("all");
    setQuery("");
    setSort("featured");
  }

  const SidebarContent = (
    <div className="space-y-8">
      {/* Search within catalog */}
      <div>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Search
        </p>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
          <input
            type="text"
            placeholder="Search products…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {query && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground"
              onClick={() => setQuery("")}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category filter */}
      <div>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Category
        </p>
        <div className="space-y-1">
          <FilterPill
            active={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
            label="All Products"
            count={products.length}
          />
          {categories.map((cat) => (
            <FilterPill
              key={cat.id}
              active={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id)}
              label={cat.name}
              count={products.filter((p) => p.category === cat.id).length}
            />
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Sort by
        </p>
        <div className="space-y-1">
          {SORT_OPTIONS.map((opt) => (
            <FilterPill
              key={opt.value}
              active={sort === opt.value}
              onClick={() => setSort(opt.value)}
              label={opt.label}
            />
          ))}
        </div>
      </div>

      {/* Clear */}
      {isFiltered && (
        <button
          onClick={clearFilters}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border/60 py-2.5 text-sm font-medium text-muted-foreground transition hover:border-foreground/20 hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
          Clear filters
        </button>
      )}
    </div>
  );

  return (
    <section className="min-h-screen bg-background">
      <Container>
        <div className="py-10 lg:flex lg:gap-12">

          {/* ── Sidebar — desktop ──────────────────────────────── */}
          <aside className="hidden lg:block lg:w-[240px] lg:shrink-0">
            <div className="sticky top-[88px]">{SidebarContent}</div>
          </aside>

          {/* ── Main content ───────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Toolbar: mobile filters + result count */}
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <button
                  className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium transition hover:border-foreground/20 lg:hidden"
                  onClick={() => setMobileOpen(true)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filter
                  {isFiltered && (
                    <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                      •
                    </span>
                  )}
                </button>

                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
                  {filtered.length === 1 ? "product" : "products"}
                  {activeCategory !== "all" && (
                    <> in <span className="font-medium text-foreground">{activeCategoryLabel}</span></>
                  )}
                </p>
              </div>

              {/* Mobile sort */}
              <div className="flex items-center gap-2 lg:hidden">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="border-0 bg-transparent text-sm font-medium text-foreground focus:outline-none"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active filter chips */}
            {isFiltered && (
              <div className="mb-5 flex flex-wrap gap-2">
                {activeCategory !== "all" && (
                  <FilterChip
                    label={activeCategoryLabel}
                    onRemove={() => setActiveCategory("all")}
                  />
                )}
                {query && (
                  <FilterChip label={`"${query}"`} onRemove={() => setQuery("")} />
                )}
                {sort !== "featured" && (
                  <FilterChip
                    label={SORT_OPTIONS.find((o) => o.value === sort)?.label ?? sort}
                    onRemove={() => setSort("featured")}
                  />
                )}
              </div>
            )}

            {/* Grid */}
            {filtered.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((product, i) => (
                  <Reveal key={product.id} variant="scale" delay={Math.min(i * 0.04, 0.3)}>
                    <ProductCard product={product} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <EmptyState onClear={clearFilters} />
            )}

            {/* Category links */}
            {!isFiltered && (
              <div className="mt-16 border-t border-border/40 pt-10">
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Browse by category
                </p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/categories/${cat.id}`}
                      className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground/70 transition hover:border-foreground/20 hover:text-foreground"
                    >
                      {cat.name}
                      <span className="ml-2 text-muted-foreground">
                        ({products.filter((p) => p.category === cat.id).length})
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* ── Mobile filter sheet ────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative ml-auto h-full w-80 max-w-full overflow-y-auto bg-background p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <p className="font-heading text-lg font-semibold">Filters</p>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {SidebarContent}
            <button
              className="mt-8 w-full rounded-2xl bg-foreground py-3.5 text-sm font-semibold text-background"
              onClick={() => setMobileOpen(false)}
            >
              Show {filtered.length} products
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function FilterPill({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition",
        active
          ? "bg-foreground text-background"
          : "text-foreground/65 hover:bg-accent hover:text-foreground",
      )}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span className={cn("text-xs", active ? "text-background/60" : "text-muted-foreground")}>
          {count}
        </span>
      )}
    </button>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card pl-3 pr-2 py-1.5 text-[12px] font-medium text-foreground">
      {label}
      <button
        onClick={onRemove}
        className="flex h-4 w-4 items-center justify-center rounded-full bg-foreground/10 text-foreground/60 transition hover:bg-foreground/20"
      >
        <X className="h-2.5 w-2.5" />
      </button>
    </span>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center py-24 text-center">
      <div className="mb-4 text-6xl opacity-20">🔦</div>
      <h3 className="font-heading text-xl font-semibold text-foreground">
        No products found
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Try adjusting your search or removing some filters.
      </p>
      <button
        onClick={onClear}
        className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-2.5 text-sm font-medium text-foreground transition hover:border-foreground/20"
      >
        <X className="h-3.5 w-3.5" />
        Clear all filters
      </button>
    </div>
  );
}
