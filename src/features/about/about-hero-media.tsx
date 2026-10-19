"use client";

import * as React from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import type { AboutBanner } from "@/domain/types";
import { cn } from "@/lib/utils";

export function AboutHeroMedia({
  banners,
  desktopClassName = "cinematic-grade hidden object-cover object-[42%_22%] md:block",
  mobileClassName = "cinematic-grade object-cover object-[center_30%] md:hidden",
}: {
  banners: AboutBanner[];
  desktopClassName?: string;
  mobileClassName?: string;
}) {
  const slides = banners.filter((b) => b.desktopImage);
  const loop = slides.length > 1;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop, dragFree: false });
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (!emblaApi || !loop) return;
    const onSelect = () => setIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    const timer = setInterval(() => emblaApi.scrollNext(), 6500);
    return () => {
      clearInterval(timer);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, loop]);

  if (!slides.length) return null;

  return (
    <div className="absolute inset-0">
      <div ref={emblaRef} className="h-full overflow-hidden">
        <div className="flex h-full">
          {slides.map((banner, i) => (
            <div key={banner.id || i} className="relative h-full min-w-0 flex-[0_0_100%]">
              <Image
                src={banner.desktopImage}
                alt={banner.alt || ""}
                fill
                priority={i === 0}
                className={desktopClassName}
                sizes="100vw"
              />
              <Image
                src={banner.mobileImage || banner.desktopImage}
                alt={banner.alt || ""}
                fill
                priority={i === 0}
                className={mobileClassName}
                sizes="100vw"
              />
              <div aria-hidden className="cinematic-overlay-warm pointer-events-none absolute inset-0" />
            </div>
          ))}
        </div>
      </div>
      {loop && (
        <div className="absolute bottom-6 right-6 z-20 flex gap-2 md:bottom-8 md:right-10">
          {slides.map((b, i) => (
            <button
              key={b.id || i}
              type="button"
              aria-label={`Banner ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-6 bg-white" : "w-1.5 bg-white/40",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
