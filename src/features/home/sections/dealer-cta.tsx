"use client";

import * as React from "react";
import { Handshake, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { CinematicImage } from "@/components/media/cinematic-image";
import { DealerDialog } from "@/features/dealers/dealer-dialog";
import { media } from "@/data/catalog/media";

const benefits = [
  { title: "Wholesale pricing", body: "Tiered rates that improve with volume." },
  { title: "Priority stock", body: "Your orders ship before open retail." },
  { title: "Full catalog", body: "All SKUs, all seasons, no MOQ surprises." },
];

export function DealerCtaSection() {
  const [open, setOpen] = React.useState(false);

  return (
    <section id="dealer" className="relative overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:min-h-[75vh]">

        {/* Image panel — fills left half edge-to-edge */}
        <div className="relative min-h-[56vw] lg:min-h-0 lg:w-1/2">
          <CinematicImage
            src={media.dealerBg}
            alt="A dim, orderly warehouse aisle lit by a single overhead light"
            fill
            grade="cool"
            containerClassName="absolute inset-0"
            sizes="(max-width:1024px) 100vw, 50vw"
          />
        </div>

        {/* Text panel — fills right half */}
        <div className="flex flex-col justify-center bg-[#080d18] px-8 py-20 text-white lg:w-1/2 lg:px-16 xl:px-24">
          <Reveal variant="fade">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-glow/70">
              Wholesale Partners
            </p>
          </Reveal>
          <Reveal variant="mask">
            <h2 className="mt-5 font-heading text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1.07] tracking-[-0.04em] text-white">
              Become a Hania
              <br />
              dealer.
            </h2>
          </Reveal>
          <Reveal variant="blur" delay={0.1}>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/50">
              Unlock distributor pricing, priority stock, and a catalog that
              sells itself — across Pakistan.
            </p>
          </Reveal>

          <Reveal variant="fade" delay={0.2}>
            <div className="mt-10 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-white px-8 text-[15px] font-semibold text-dark transition hover:bg-white/90"
              >
                <Handshake className="h-4 w-4" />
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="#faq"
                className="inline-flex h-12 items-center text-[15px] font-medium text-white/45 transition hover:text-white"
              >
                Learn more
              </a>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-6 border-t border-white/10 pt-10 sm:grid-cols-3">
            {benefits.map((b, i) => (
              <Reveal key={b.title} variant="fade" delay={0.28 + i * 0.06}>
                <div>
                  <p className="text-sm font-semibold text-white">{b.title}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/35">{b.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <DealerDialog open={open} onOpenChange={setOpen} />
    </section>
  );
}
