"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { CinematicImage } from "@/components/media/cinematic-image";
import { DealerDialog } from "@/features/dealers/dealer-dialog";
import { media } from "@/data/catalog/media";

export function HeroSection() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const [dealerOpen, setDealerOpen] = React.useState(false);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] overflow-hidden bg-[#0d1526] text-white"
    >
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <CinematicImage
          src={media.hero}
          alt="A warm pendant light glowing in a quiet, minimal bedroom at golden hour"
          fill
          priority
          grade="warm"
          vignette={false}
          containerClassName="absolute inset-0"
          className="object-[42%_22%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/15 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </motion.div>

      <Container className="relative z-10 flex min-h-[100svh] items-end pb-20 pt-28 md:pb-28">
        <div className="max-w-[640px]">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="mb-7 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50 sm:text-xs"
          >
            Hania Electronics
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading font-semibold tracking-[-0.045em] text-white"
          >
            <span className="block text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.02]">
              Every good evening
              <br />
              starts with light.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.36 }}
            className="mt-6 max-w-[380px] text-[15px] leading-[1.7] text-white/65"
          >
            Emergency, solar, and everyday lighting — built to disappear into
            the room until the moment you need it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.5 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#bestsellers"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-[15px] font-semibold text-dark transition hover:bg-white/90"
            >
              Shop the collection
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <button
              type="button"
              onClick={() => setDealerOpen(true)}
              className="text-[15px] font-medium text-white/75 underline-offset-4 transition hover:text-white hover:underline"
            >
              Become a dealer
            </button>
          </motion.div>
        </div>
      </Container>

      <DealerDialog open={dealerOpen} onOpenChange={setDealerOpen} />
    </section>
  );
}
