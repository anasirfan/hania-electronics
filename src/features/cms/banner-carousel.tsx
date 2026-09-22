"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import type { Banner } from "@/domain/types";
import { cn } from "@/lib/utils";

export function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    const timer = setInterval(() => emblaApi.scrollNext(), 5500);
    return () => {
      clearInterval(timer);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  if (!banners.length) return null;

  return (
    <section className="relative overflow-hidden bg-[#050A1F]">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {banners.map((banner) => (
            <div key={banner.id} className="relative min-w-0 flex-[0_0_100%]">
              <div className="relative aspect-[16/7] min-h-[280px] w-full md:aspect-[21/8] md:min-h-[420px]">
                <Image
                  src={banner.desktopImage}
                  alt={banner.title}
                  fill
                  priority
                  className="hidden object-cover md:block"
                  sizes="100vw"
                />
                <Image
                  src={banner.mobileImage || banner.desktopImage}
                  alt={banner.title}
                  fill
                  priority
                  className="object-cover md:hidden"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050A1F]/80 via-[#050A1F]/35 to-transparent" />
                <div className="absolute inset-0 flex items-center">
                  <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
                    <h1 className="max-w-xl font-heading text-3xl font-semibold tracking-tight text-white md:text-5xl">
                      {banner.title}
                    </h1>
                    {banner.subtitle ? (
                      <p className="mt-3 max-w-lg text-sm text-white/80 md:text-base">
                        {banner.subtitle}
                      </p>
                    ) : null}
                    <Button asChild className="mt-6" size="lg">
                      <Link href={banner.ctaLink || "/shop"}>
                        {banner.ctaText || "Shop Now"}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {banners.map((b, i) => (
          <button
            key={b.id}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              "h-2 w-2 rounded-full bg-white/40",
              i === index && "w-6 bg-white",
            )}
            onClick={() => emblaApi?.scrollTo(i)}
          />
        ))}
      </div>
    </section>
  );
}
