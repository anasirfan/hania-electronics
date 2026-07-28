import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { testimonials } from "@/data/catalog/testimonials";
import { cn } from "@/lib/utils";

export function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden bg-[#05070c] py-24 text-white md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(34,211,238,0.06),transparent_55%)]"
      />
      <Container>
        <Reveal variant="fade">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/30">
            Voices across Pakistan
          </p>
        </Reveal>

        <div className="mt-12 border-t border-white/10">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} variant="fade" delay={i * 0.07}>
              <div
                className={cn(
                  "border-b border-white/8 py-10 lg:py-12",
                  i % 2 === 1 && "flex flex-col items-end text-right",
                )}
              >
                <blockquote
                  className="max-w-2xl font-heading text-xl font-light leading-[1.45] tracking-tight text-white/85 sm:text-2xl lg:text-[1.75rem]"
                >
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/30">
                  &mdash; {t.name} &middot; {t.role} &middot; {t.city}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
