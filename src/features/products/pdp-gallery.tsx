"use client";

import * as React from "react";
import Image from "next/image";
import { ZoomIn, ZoomOut, Expand, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryImage {
  src: string | null;
  alt: string;
  label?: string;
}

interface PdpGalleryProps {
  images: GalleryImage[];
  productName: string;
}

export function PdpGallery({ images, productName }: PdpGalleryProps) {
  const [active, setActive] = React.useState(0);
  const [zoomed, setZoomed] = React.useState(false);
  const [fullscreen, setFullscreen] = React.useState(false);

  const activeImage = images[active] ?? images[0];
  const total = images.length;

  const prev = () => setActive((i) => (i - 1 + total) % total);
  const next = () => setActive((i) => (i + 1) % total);

  React.useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <>
      <div className="flex h-full flex-col bg-[#0d1526]">
        {/* Main image */}
        <div
          className={cn(
            "relative flex flex-1 items-center justify-center overflow-hidden",
            activeImage.src ? "cursor-zoom-in" : "cursor-default",
            zoomed && "cursor-zoom-out",
          )}
          onClick={() => activeImage.src && setZoomed((z) => !z)}
        >
          {/* Ambient glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] opacity-70"
            style={{
              background:
                "radial-gradient(ellipse 70% 55% at 50% 100%, rgba(34,211,238,0.18), rgba(11,107,203,0.08), transparent 68%)",
            }}
          />

          {activeImage.src ? (
            <div
              className={cn(
                "relative h-full w-full transition-transform duration-500 ease-out",
                zoomed ? "scale-150" : "scale-100",
              )}
            >
              <Image
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                className="object-contain p-10"
                sizes="(max-width: 1024px) 100vw, 58vw"
                priority
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <div className="relative h-48 w-48 rounded-full"
                style={{ boxShadow: "0 0 80px 20px rgba(34,211,238,0.15)" }} />
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-white/25">
                {productName}
              </p>
            </div>
          )}

          {/* Top-right controls */}
          <div className="absolute right-4 top-4 flex flex-col gap-2">
            {activeImage.src && (
              <button
                onClick={(e) => { e.stopPropagation(); setFullscreen(true); }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-white/60 backdrop-blur-md transition hover:bg-white/15 hover:text-white"
                aria-label="Fullscreen"
              >
                <Expand className="h-4 w-4" />
              </button>
            )}
            {activeImage.src && (
              <button
                onClick={(e) => { e.stopPropagation(); setZoomed((z) => !z); }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-white/60 backdrop-blur-md transition hover:bg-white/15 hover:text-white"
                aria-label={zoomed ? "Zoom out" : "Zoom in"}
              >
                {zoomed ? (
                  <ZoomOut className="h-4 w-4" />
                ) : (
                  <ZoomIn className="h-4 w-4" />
                )}
              </button>
            )}
          </div>

          {/* Navigation arrows — only when multiple images */}
          {total > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-white/60 backdrop-blur-md transition hover:bg-white/15 hover:text-white"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-14 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-white/60 backdrop-blur-md transition hover:bg-white/15 hover:text-white"
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Bottom strip */}
        <div className="flex items-center justify-between border-t border-white/6 px-4 py-3">
          {/* Thumbnails */}
          <div className="flex gap-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => { setActive(i); setZoomed(false); }}
                className={cn(
                  "relative h-12 w-12 overflow-hidden rounded-lg border-2 transition",
                  i === active
                    ? "border-primary-glow"
                    : "border-white/10 opacity-50 hover:opacity-80",
                )}
                aria-label={img.label ?? `View ${i + 1}`}
              >
                {img.src ? (
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white/5">
                    <span className="text-[9px] font-medium uppercase tracking-wide text-white/30">
                      {img.label ?? `0${i + 1}`}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Counter */}
          <span className="font-mono text-[11px] text-white/30">
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Fullscreen overlay */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/96"
          onClick={() => setFullscreen(false)}
        >
          {activeImage.src && (
            <div className="relative h-full w-full max-w-5xl">
              <Image
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                className="object-contain p-8"
                sizes="100vw"
              />
            </div>
          )}

          <button
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
            onClick={() => setFullscreen(false)}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {total > 1 && (
            <>
              <button
                className="absolute left-5 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                className="absolute right-5 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs text-white/40">
            {active + 1} / {total}
          </div>
        </div>
      )}
    </>
  );
}
