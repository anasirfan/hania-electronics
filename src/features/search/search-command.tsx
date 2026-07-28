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
import { productRepository } from "@/features/products/repository";
import type { Product } from "@/features/products/types";
import { formatPKR } from "@/lib/utils";
import { productWhatsAppMessage, whatsappUrl } from "@/lib/brand";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ArrowRight } from "lucide-react";

const POPULAR = [
  "LED Torch",
  "Emergency Flashlight",
  "Solar Lantern",
  "Headlamp",
  "COB Work Light",
];

const QUICK_LINKS = [
  { label: "All Products", href: "/products" },
  { label: "Bestsellers", href: "/products?sort=featured" },
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
    void productRepository.getAll().then(setItems);
  }, []);

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

  // Reset query when closed
  React.useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const filtered = query.trim()
    ? items.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.category.includes(query.toLowerCase()),
      )
    : items.filter((p) => p.bestseller || p.featured).slice(0, 5);

  function goToProduct(slug: string) {
    router.push(`/products/${slug}`);
    onOpenChange(false);
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <div className="flex items-center border-b border-border px-4">
        <CommandInput
          placeholder="Search torches, solar lights, headlamps…"
          value={query}
          onValueChange={setQuery}
          className="h-14 flex-1 text-base"
        />
        <kbd className="ml-2 hidden rounded-md border border-border bg-accent px-2 py-1 font-mono text-[11px] text-muted-foreground sm:block">
          ESC
        </kbd>
      </div>

      <CommandList className="max-h-[480px]">
        {/* Empty state */}
        <CommandEmpty>
          <div className="py-10 text-center">
            <p className="text-sm font-medium text-foreground">
              No results for &ldquo;{query}&rdquo;
            </p>
            <p className="mt-1 text-[12px] text-muted-foreground">
              Try searching for torch, solar, emergency, or headlamp.
            </p>
          </div>
        </CommandEmpty>

        {/* No query — show popular + quick links */}
        {!query.trim() && (
          <>
            <CommandGroup
              heading={
                <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em]">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Popular searches
                </span>
              }
            >
              {POPULAR.map((term) => (
                <CommandItem
                  key={term}
                  value={term}
                  onSelect={() => setQuery(term)}
                  className="cursor-pointer"
                >
                  <span className="text-sm text-foreground/80">{term}</span>
                  <ArrowRight className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup heading="Quick links">
              {QUICK_LINKS.map((link) => (
                <CommandItem
                  key={link.href}
                  value={link.label}
                  onSelect={() => {
                    router.push(link.href);
                    onOpenChange(false);
                  }}
                  className="cursor-pointer"
                >
                  <span className="text-sm text-foreground/80">{link.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* Products */}
        {filtered.length > 0 && (
          <CommandGroup
            heading={
              query.trim()
                ? `Products (${filtered.length})`
                : "Featured products"
            }
          >
            {filtered.map((product) => (
              <CommandItem
                key={product.id}
                value={`${product.name} ${product.category} ${product.description}`}
                onSelect={() => goToProduct(product.slug)}
                className="cursor-pointer py-3"
              >
                {/* Product thumbnail */}
                <div className="relative mr-3 h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#0d1526]">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt=""
                      fill
                      className="object-contain p-1.5"
                      sizes="48px"
                    />
                  ) : null}
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium text-foreground">
                      {product.name}
                    </span>
                    {product.badge && (
                      <Badge variant={product.badge} className="shrink-0 scale-90">
                        {product.badge}
                      </Badge>
                    )}
                  </div>
                  <span className="truncate text-[12px] text-muted-foreground">
                    {product.description}
                  </span>
                </div>

                {/* Price */}
                <span className="ml-3 shrink-0 font-heading text-sm font-semibold text-foreground">
                  {formatPKR(product.pricePkr)}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Order on WhatsApp hint */}
        {query.trim() && filtered.length > 0 && (
          <div className="border-t border-border px-4 py-3">
            <button
              className="flex w-full items-center gap-2 text-[12px] text-muted-foreground hover:text-foreground transition"
              onClick={() => {
                window.open(
                  whatsappUrl(`I'm looking for: ${query}`),
                  "_blank",
                  "noopener,noreferrer",
                );
                onOpenChange(false);
              }}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#25D366]/15 text-[#25D366]">
                💬
              </span>
              Ask on WhatsApp about &ldquo;{query}&rdquo;
            </button>
          </div>
        )}
      </CommandList>
    </CommandDialog>
  );
}
