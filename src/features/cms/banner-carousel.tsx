"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import type { Banner } from "@/domain/types";
import { cn } from "@/lib/utils";

export function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: false });
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
              <div className="relative aspect-[4/5] w-full min-h-[340px] max-h-[560px] sm:aspect-[16/9] sm:min-h-[360px] md:aspect-[21/8] md:min-h-[420px] md:max-h-none">
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#050A1F]/90 via-[#050A1F]/35 to-[#050A1F]/20 md:bg-gradient-to-r md:from-[#050A1F]/80 md:via-[#050A1F]/35 md:to-transparent" />
                <div className="absolute inset-0 flex items-end md:items-center">
                  <div className="mx-auto w-full max-w-6xl px-5 pb-14 pt-10 sm:px-6 md:px-8 md:pb-0">
                    <h1 className="max-w-xl font-heading text-[1.75rem] font-semibold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                      {banner.title}
                    </h1>
                    {banner.subtitle ? (
                      <p className="mt-2 max-w-lg text-sm text-white/80 sm:mt-3 sm:text-base">
                        {banner.subtitle}
                      </p>
                    ) : null}
                    <Button asChild className="mt-5 sm:mt-6" size="lg">
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
              "h-2 rounded-full bg-white/40 transition-all",
              i === index ? "w-6 bg-white" : "w-2",
            )}
            onClick={() => emblaApi?.scrollTo(i)}
          />
        ))}
      </div>
    </section>
  );
}
