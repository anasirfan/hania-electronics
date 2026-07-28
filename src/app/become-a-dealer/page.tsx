import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { CinematicImage } from "@/components/media/cinematic-image";
import { DealerApplicationForm } from "@/features/dealers/dealer-application-form";
import { media } from "@/data/catalog/media";
import { Check } from "lucide-react";

export const metadata = {
  title: "Become a Dealer — HANIA Electronics",
  description:
    "Apply for a Hania Electronics wholesale account. Distributor pricing, priority stock, and full catalog access across Pakistan.",
};

const perks = [
  { title: "Wholesale pricing", body: "Tiered rates that improve with your order volume." },
  { title: "Priority stock allocation", body: "Your orders are shipped before open retail demand." },
  { title: "Full catalog access", body: "Every SKU, every season — no minimum order surprises." },
  { title: "WhatsApp support line", body: "A dedicated contact who knows your account." },
  { title: "Marketing materials", body: "Product images and specs ready to share with customers." },
  { title: "Flexible reorder", body: "Order on WhatsApp anytime — no portal friction." },
];

export default function BecomeDealerPage() {
  return (
    <main className="min-h-screen bg-background pt-[72px]">

      {/* ── Split hero ── */}
      <section className="overflow-hidden lg:flex lg:min-h-[75vh]">
        {/* Image */}
        <div className="relative min-h-[55vw] lg:min-h-0 lg:w-1/2">
          <CinematicImage
            src={media.dealerBg}
            alt="Organized warehouse lit by a single overhead light"
            fill
            grade="cool"
            containerClassName="absolute inset-0"
            sizes="(max-width:1024px) 100vw, 50vw"
          />
        </div>

        {/* Text */}
        <div className="flex flex-col justify-center bg-[#05070c] px-8 py-20 text-white lg:w-1/2 lg:px-16 xl:px-24">
          <Reveal variant="fade">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/30">
              Wholesale Partners
            </p>
          </Reveal>
          <Reveal variant="slide" delay={0.1}>
            <h1 className="mt-5 font-heading text-[clamp(2.2rem,4.5vw,3.5rem)] font-semibold leading-[1.06] tracking-[-0.04em] text-white">
              Sell Hania.
              <br />
              Grow your shop.
            </h1>
          </Reveal>
          <Reveal variant="blur" delay={0.1}>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/50">
              Join 200+ dealers across Pakistan who stock Hania Electronics.
              Competitive margins, dependable stock, and products that customers
              come back for.
            </p>
          </Reveal>

          <Reveal variant="fade" delay={0.18}>
            <ul className="mt-8 space-y-3">
              {perks.slice(0, 3).map((p) => (
                <li key={p.title} className="flex items-start gap-3 text-sm text-white/60">
                  <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary-glow">
                    <Check className="h-2.5 w-2.5" />
                  </span>
                  <span>
                    <strong className="font-semibold text-white">{p.title}</strong>{" "}
                    — {p.body}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ── Full perks grid ── */}
      <section className="bg-[#080d18] py-20 text-white md:py-28">
        <Container>
          <Reveal variant="fade">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/30">
              What you get
            </p>
          </Reveal>
          <Reveal variant="mask">
            <h2 className="mb-14 font-heading text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Dealer benefits
            </h2>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {perks.map((p, i) => (
              <Reveal key={p.title} variant="scale" delay={i * 0.05}>
                <div className="rounded-2xl border border-white/8 bg-white/4 p-6">
                  <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-4 w-4 text-primary-glow" />
                  </div>
                  <h3 className="font-heading text-base font-semibold text-white">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/45">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Application form ── */}
      <section className="py-20 md:py-28">
        <Container className="max-w-2xl">
          <Reveal variant="fade">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Apply now
            </p>
          </Reveal>
          <Reveal variant="mask">
            <h2 className="mb-2 font-heading text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Tell us about your business
            </h2>
          </Reveal>
          <Reveal variant="blur" delay={0.08}>
            <p className="mb-10 text-muted-foreground">
              We review every application and reach out within 24 hours on
              WhatsApp.
            </p>
          </Reveal>
          <Reveal variant="fade" delay={0.12}>
            <DealerApplicationForm />
          </Reveal>
        </Container>
      </section>
    </main>
  );
}
