"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

const CONTAIN_SOURCES = new Set([
  "/products-clean/headlamp.webp",
  "/products-clean/emergency-flashlight.webp",
]);

export function ProductVisual({
  src,
  alt,
  className,
  priority = false,
  size = "md",
}: {
  src: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const contain = src
    ? CONTAIN_SOURCES.has(src) || src.startsWith("/products/catalog/")
    : false;

  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden bg-white",
        className,
      )}
      style={{ cursor: src ? "zoom-in" : "default" }}
      data-size={size}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className={cn(
            "transition-transform duration-700 group-hover:scale-[1.03]",
            contain ? "object-contain p-2" : "object-cover",
          )}
          sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 400px"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[#f0f4f8]">
          <p className="px-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-foreground/30">
            Photography in progress
          </p>
        </div>
      )}
    </div>
  );
}
