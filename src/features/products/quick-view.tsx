"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductVisual } from "@/features/products/product-visual";
import type { Product } from "@/features/products/types";
import { formatPKR } from "@/lib/utils";
import {
  productWhatsAppMessage,
  telUrl,
  whatsappUrl,
  BRAND,
} from "@/lib/brand";
import { MessageCircle, Phone } from "lucide-react";

export function QuickView({
  product,
  open,
  onOpenChange,
}: {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-hidden p-0 sm:grid sm:grid-cols-2">
        <div className="bg-[#0f1a2c] p-4 sm:p-6">
          <ProductVisual src={product.image} alt={product.name} size="lg" />
        </div>
        <div className="flex flex-col gap-4 p-6 pt-10 sm:pt-6">
          <DialogHeader>
            <div className="mb-2 flex flex-wrap gap-2">
              {product.badge ? (
                <Badge variant={product.badge}>{product.badge}</Badge>
              ) : null}
              <Badge variant={product.inStock ? "stock" : "outline"}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>
            <DialogTitle>{product.name}</DialogTitle>
            <DialogDescription>{product.description}</DialogDescription>
          </DialogHeader>
          <p className="font-heading text-2xl font-semibold text-foreground">
            {formatPKR(product.pricePkr)}
            {product.compareAtPkr ? (
              <span className="ml-2 text-base font-normal text-muted-foreground line-through">
                {formatPKR(product.compareAtPkr)}
              </span>
            ) : null}
          </p>
          <ul className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            {product.features.map((f) => (
              <li key={f} className="rounded-xl bg-accent/50 px-3 py-2">
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col gap-2">
            <Button variant="whatsapp" asChild>
              <a
                href={whatsappUrl(
                  productWhatsAppMessage(product.name, product.pricePkr),
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle /> Order on WhatsApp
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href={telUrl(BRAND.phones.primary)}>
                <Phone /> Call Now
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
