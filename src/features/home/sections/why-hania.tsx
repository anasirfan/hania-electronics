import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";

const reasons = [
  {
    num: "01",
    title: "Built to last",
    body: "Selected for durability, not disposable catalogue plastics.",
  },
  {
    num: "02",
    title: "Clear pricing",
    body: "Honest retail rates, with wholesale paths for partners.",
  },
  {
    num: "03",
    title: "Delivered with care",
    body: "From Karachi to your city — packed and tracked properly.",
  },
  {
    num: "04",
    title: "Real support",
    body: "WhatsApp and call support from people who know the products.",
  },
];

export function WhyHaniaSection() {
  return (
    <section
      id="why"
      className="relative overflow-hidden bg-[#05070c] py-28 text-white md:py-44"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_40%_at_50%_0%,rgba(34,211,238,0.07),transparent_55%)]"
      />
      <Container>
        <div className="max-w-2xl">
          <Reveal variant="fade">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/30">
              Why Hania
            </p>
          </Reveal>
          <Reveal variant="mask">
            <h2 className="mt-4 font-heading text-[clamp(2.2rem,5vw,3.75rem)] font-semibold leading-[1.06] tracking-[-0.04em] text-white">
              Made for real
              <br />
              Pakistani nights.
            </h2>
          </Reveal>
          <Reveal variant="blur" delay={0.1}>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-white/40">
              Load-shedding, job sites, family homes — lights that stay bright
              when it matters.
            </p>
          </Reveal>
        </div>

        <div className="mt-20 border-t border-white/10">
          {reasons.map((reason, i) => (
            <Reveal key={reason.num} variant="slide" delay={i * 0.07}>
              <div className="flex flex-col gap-3 border-b border-white/8 py-8 sm:flex-row sm:items-baseline sm:gap-10 lg:gap-20">
                <span className="shrink-0 font-heading text-[11px] font-medium tabular-nums tracking-[0.2em] text-white/20 sm:w-12">
                  {reason.num}
                </span>
                <h3 className="flex-1 font-heading text-xl font-semibold tracking-tight text-white sm:text-2xl lg:text-3xl">
                  {reason.title}
                </h3>
                <p className="max-w-xs text-[13px] leading-relaxed text-white/40 sm:text-sm lg:max-w-sm">
                  {reason.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
