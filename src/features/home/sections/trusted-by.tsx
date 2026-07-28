import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";

const stats = [
  { value: "12K+", label: "Homes lit across Pakistan" },
  { value: "200+", label: "Active dealer partners" },
  { value: "9", label: "Product categories" },
];

const pillars = [
  { title: "Wholesale & retail", body: "One catalog for shops, dealers, and households." },
  { title: "Karachi rooted", body: "Falak Corporate City — serving partners across Pakistan." },
  { title: "WhatsApp first", body: "Order, track, and get answers without the friction." },
];

export function TrustedBySection() {
  return (
    <section id="trusted" className="relative overflow-hidden bg-[#080d18] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_110%,rgba(34,211,238,0.07),transparent_55%)]"
      />

      {/* Giant stat row */}
      <div className="border-b border-white/8">
        <Container className="py-14 md:py-20">
          <div className="grid divide-y divide-white/8 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {stats.map((s, i) => (
              <Reveal key={s.value} variant="fade" delay={i * 0.09}>
                <div className="px-0 py-8 sm:px-10 sm:py-0 sm:first:pl-0 sm:last:pr-0">
                  <p className="font-heading text-5xl font-bold tracking-[-0.04em] text-white sm:text-6xl xl:text-7xl">
                    {s.value}
                  </p>
                  <p className="mt-2.5 text-sm text-white/40">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </div>

      {/* Pillars strip */}
      <Container className="py-12 md:py-16">
        <div className="grid gap-8 sm:grid-cols-3">
          {pillars.map((item, i) => (
            <Reveal key={item.title} variant="slide" delay={i * 0.06}>
              <div className="border-t border-white/10 pt-5">
                <h3 className="font-heading text-sm font-semibold tracking-tight text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/40">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
