"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { formatPKR } from "@/lib/money";
import {
  getEffectivePrice,
  getPrimaryImage,
  type Product,
} from "@/domain/types";
import { ArrowRight } from "lucide-react";

const POPULAR = [
  "LED Torch",
  "Emergency Light",
  "Solar Lantern",
  "Metal Light",
  "Flash Light",
];

const QUICK_LINKS = [
  { label: "All Products", href: "/shop" },
  { label: "Popular picks", href: "/shop?sort=featured" },
  { label: "About Us", href: "/about" },
  { label: "Become a Dealer", href: "/become-a-dealer" },
];

export function SearchCommand({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [items, setItems] = React.useState<Product[]>([]);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    const q = query.trim();
    const url = q ? `/api/search?q=${encodeURIComponent(q)}` : "/api/catalog";
    void fetch(url)
      .then((r) => r.json())
      .then((d) => {
        const products = (d.products ?? []) as Product[];
        if (!q) {
          setItems(
            products
              .filter((p) => p.bestSeller || p.featured)
              .slice(0, 6),
          );
        } else {
          setItems(products);
        }
      });
  }, [open, query]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  React.useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  function goToProduct(slug: string) {
    router.push(`/product/${slug}`);
    onOpenChange(false);
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search lights, torches, solar…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No products found.</CommandEmpty>
        {!query.trim() ? (
          <CommandGroup heading="Quick links">
            {QUICK_LINKS.map((link) => (
              <CommandItem
                key={link.href}
                onSelect={() => {
                  router.push(link.href);
                  onOpenChange(false);
                }}
              >
                <ArrowRight className="mr-2 h-4 w-4" />
                {link.label}
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}
        {!query.trim() ? (
          <CommandGroup heading="Popular searches">
            {POPULAR.map((term) => (
              <CommandItem key={term} onSelect={() => setQuery(term)}>
                {term}
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}
        <CommandGroup heading={query.trim() ? "Results" : "Featured"}>
          {items.map((product) => {
            const image = getPrimaryImage(product);
            return (
              <CommandItem
                key={product.id}
                value={product.name}
                onSelect={() => goToProduct(product.slug)}
              >
                <div className="flex w-full items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-accent">
                    {image ? (
                      <Image src={image} alt="" fill className="object-cover" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatPKR(getEffectivePrice(product))}
                    </p>
                  </div>
                </div>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
