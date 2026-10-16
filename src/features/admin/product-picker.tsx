"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronDown, Plus, Check, Search, ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn, formatPKR } from "@/lib/utils";
import {
  getEffectivePrice,
  getPrimaryImage,
  type Category,
  type Product,
} from "@/domain/types";

export function Thumb({
  src,
  alt,
  size = 40,
  className,
}: {
  src: string | null;
  alt: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative block shrink-0 overflow-hidden rounded-lg bg-[#F4F6F9] shadow-[inset_0_0_0_1px_rgba(11,18,32,0.08)]",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image src={src} alt={alt} fill sizes={`${size}px`} className="object-cover" />
      ) : (
        <ImageIcon className="absolute inset-0 m-auto h-4 w-4 text-muted-foreground/50" />
      )}
    </span>
  );
}

/**
 * Modal picker: products grouped by category (expandable), "+" to add.
 * Selection changes are applied immediately via onChange.
 */
export function ProductPicker({
  open,
  onOpenChange,
  title,
  products,
  categories,
  selected,
  onChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  products: Product[];
  categories: Category[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const [query, setQuery] = React.useState("");
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  const q = query.trim().toLowerCase();
  const groups = React.useMemo(() => {
    const byCat = new Map<string, Product[]>();
    for (const p of products) {
      if (q && !`${p.name} ${p.sku}`.toLowerCase().includes(q)) continue;
      const list = byCat.get(p.categoryId) ?? [];
      list.push(p);
      byCat.set(p.categoryId, list);
    }
    const ordered = [...categories]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((c) => ({ category: c, items: byCat.get(c.id) ?? [] }))
      .filter((g) => g.items.length > 0);
    // Products whose category isn't in the list
    const known = new Set(categories.map((c) => c.id));
    const orphans = [...byCat.entries()]
      .filter(([id]) => !known.has(id))
      .flatMap(([, items]) => items);
    if (orphans.length) {
      ordered.push({
        category: {
          id: "__other",
          name: "Other",
          slug: "other",
          description: "",
          image: null,
          featured: false,
          sortOrder: 999,
          active: true,
          createdAt: "",
          updatedAt: "",
        },
        items: orphans,
      });
    }
    return ordered;
  }, [products, categories, q]);

  const selectedSet = new Set(selected);

  function toggle(id: string) {
    onChange(
      selectedSet.has(id) ? selected.filter((x) => x !== id) : [...selected, id],
    );
  }

  function isOpen(catId: string) {
    // Search open → expand everything; otherwise respect toggle (default open)
    if (q) return true;
    return expanded[catId] ?? true;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-border px-6 py-5">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Click <span className="font-semibold text-foreground">+</span> to add a
            product. Click again to remove. {selected.length} selected.
          </DialogDescription>
          <div className="relative mt-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or SKU…"
              className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto px-3 py-3">
          {groups.length === 0 && (
            <p className="px-3 py-10 text-center text-sm text-muted-foreground">
              No products match.
            </p>
          )}
          {groups.map(({ category, items }) => {
            const openCat = isOpen(category.id);
            const picked = items.filter((p) => selectedSet.has(p.id)).length;
            return (
              <div key={category.id} className="mb-2 rounded-xl border border-border/70">
                <button
                  type="button"
                  onClick={() =>
                    setExpanded((s) => ({ ...s, [category.id]: !openCat }))
                  }
                  className="flex w-full items-center gap-3 rounded-t-xl px-3 py-2.5 text-left hover:bg-accent/60"
                >
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform",
                      openCat ? "rotate-0" : "-rotate-90",
                    )}
                  />
                  <span className="flex-1 text-sm font-semibold">{category.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {picked > 0 && (
                      <span className="mr-2 rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary">
                        {picked} added
                      </span>
                    )}
                    {items.length} items
                  </span>
                </button>
                {openCat && (
                  <ul className="divide-y divide-border/60 border-t border-border/70">
                    {items.map((p) => {
                      const on = selectedSet.has(p.id);
                      return (
                        <li key={p.id}>
                          <button
                            type="button"
                            onClick={() => toggle(p.id)}
                            className={cn(
                              "flex w-full items-center gap-3 px-3 py-2 text-left transition",
                              on ? "bg-primary/5" : "hover:bg-accent/50",
                            )}
                          >
                            <Thumb src={getPrimaryImage(p)} alt={p.name} size={44} />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium">
                                {p.name}
                              </span>
                              <span className="block text-xs text-muted-foreground">
                                {p.sku} · {formatPKR(getEffectivePrice(p))}
                                {!p.published && (
                                  <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-amber-700">
                                    Draft
                                  </span>
                                )}
                              </span>
                            </span>
                            <span
                              className={cn(
                                "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition",
                                on
                                  ? "border-primary bg-primary text-white"
                                  : "border-border bg-white text-foreground/70",
                              )}
                              aria-hidden
                            >
                              {on ? (
                                <Check className="h-4 w-4" strokeWidth={3} />
                              ) : (
                                <Plus className="h-4 w-4" />
                              )}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <span className="text-sm text-muted-foreground">
            {selected.length} selected
          </span>
          <Button type="button" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Simple flat picker for categories. */
export function CategoryPicker({
  open,
  onOpenChange,
  categories,
  selected,
  onChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const selectedSet = new Set(selected);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-border px-6 py-5">
          <DialogTitle>Add categories</DialogTitle>
          <DialogDescription>
            Click <span className="font-semibold text-foreground">+</span> to
            feature a category on the homepage.
          </DialogDescription>
        </DialogHeader>
        <ul className="max-h-[60vh] divide-y divide-border/60 overflow-y-auto">
          {[...categories]
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((c) => {
              const on = selectedSet.has(c.id);
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() =>
                      onChange(
                        on ? selected.filter((x) => x !== c.id) : [...selected, c.id],
                      )
                    }
                    className={cn(
                      "flex w-full items-center gap-3 px-5 py-2.5 text-left transition",
                      on ? "bg-primary/5" : "hover:bg-accent/50",
                    )}
                  >
                    <Thumb src={c.image} alt={c.name} size={40} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{c.name}</span>
                      {!c.active && (
                        <span className="text-xs text-amber-700">Inactive</span>
                      )}
                    </span>
                    <span
                      className={cn(
                        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition",
                        on
                          ? "border-primary bg-primary text-white"
                          : "border-border bg-white text-foreground/70",
                      )}
                      aria-hidden
                    >
                      {on ? <Check className="h-4 w-4" strokeWidth={3} /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                </li>
              );
            })}
        </ul>
        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <span className="text-sm text-muted-foreground">{selected.length} selected</span>
          <Button type="button" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
