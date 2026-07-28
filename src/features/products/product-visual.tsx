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
  const minHeights = {
    sm: "min-h-40",
    md: "min-h-52",
    lg: "min-h-64 md:min-h-72",
    xl: "min-h-72 md:min-h-96",
  };

  const contain = src
    ? CONTAIN_SOURCES.has(src) || src.startsWith("/products/catalog/")
    : false;

  return (
    <div
      className={cn(
        "relative w-full flex-1 overflow-hidden bg-gradient-to-b from-[#0d1526] via-[#0a1220] to-[#0f1a2c]",
        minHeights[size],
        className,
      )}
    >
      <div className="product-underglow absolute inset-x-0 bottom-0 z-[1] h-1/3 blur-2xl" />

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
          sizes="(max-width:768px) 90vw, 420px"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,rgba(34,211,238,0.28),transparent_60%)]"
          />
          <p className="relative z-[1] px-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-white/35">
            Photography in progress
          </p>
        </div>
      )}

      {src && !contain ? (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
      ) : null}
    </div>
  );
}
