import Link from "next/link";
import {
  MessageCircle,
  Phone,
  MapPin,
  Clock,
  Mail,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { BRAND, whatsappUrl, telUrl } from "@/lib/brand";

export const metadata = {
  title: "Contact — HANIA Electronics",
  description:
    "Get in touch with HANIA Electronics. WhatsApp, call, or visit our showroom in Karachi's Boulton Market.",
};

const HOURS = [
  { day: "Monday – Thursday", hours: "9:00 AM – 8:00 PM" },
  { day: "Friday", hours: "9:00 AM – 12:30 PM, 2:30 PM – 8:00 PM" },
  { day: "Saturday", hours: "9:00 AM – 8:00 PM" },
  { day: "Sunday", hours: "10:00 AM – 6:00 PM" },
];

const CONTACTS = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: BRAND.phones.whatsapp,
    display: `+92 ${BRAND.phones.whatsapp.slice(1)}`,
    href: whatsappUrl("Assalam o Alaikum! I'd like to enquire about your products."),
    description: "Fastest response — typically under 5 minutes during business hours.",
    cta: "Chat on WhatsApp",
    color: "bg-[#25D366]",
    external: true,
  },
  {
    icon: Phone,
    label: "Phone",
    value: BRAND.phones.primary,
    display: BRAND.phones.primaryDisplay,
    href: telUrl(BRAND.phones.primary),
    description: "Speak directly with our team about products, orders, or wholesale rates.",
    cta: "Call now",
    color: "bg-primary",
    external: false,
  },
  {
    icon: Phone,
    label: "Landline",
    value: BRAND.phones.landline,
    display: BRAND.phones.landlineDisplay,
    href: telUrl(BRAND.phones.landline),
    description: "Office line — open during regular business hours.",
    cta: "Call office",
    color: "bg-secondary",
    external: false,
  },
];

const MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=Falak+Corporate+City+Talpur+Road+Boulton+Market+Karachi";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#05070c] pt-[72px] text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 65% 55% at 15% 50%, rgba(34,211,238,0.07), transparent 55%), radial-gradient(ellipse 45% 45% at 85% 50%, rgba(245,197,122,0.05), transparent 50%)",
          }}
        />
        <Container className="relative py-20 md:py-28">
          <Reveal variant="fade">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/35">
              Get in touch
            </p>
          </Reveal>
          <Reveal variant="slide" delay={0.05}>
            <h1 className="mt-4 font-heading text-[clamp(2.2rem,5vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.04em]">
              We're in Karachi.
              <br />
              <span className="text-primary-glow">We answer fast.</span>
            </h1>
          </Reveal>
          <Reveal variant="blur" delay={0.1}>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/45">
              WhatsApp is the fastest way to reach us. A real person responds —
              no bots, no queues, no ticket numbers.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ── Contact cards ────────────────────────────────────── */}
      <section className="bg-background py-16 md:py-24">
        <Container>
          <div className="grid gap-5 md:grid-cols-3">
            {CONTACTS.map((c, i) => {
              const Icon = c.icon;
              return (
                <Reveal key={c.label} variant="scale" delay={i * 0.06}>
                  <div className="flex h-full flex-col rounded-[24px] border border-border/50 bg-card p-7 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-12px_rgba(11,107,203,0.12)]">
                    <div
                      className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${c.color} shadow-[0_6px_20px_-4px_rgba(0,0,0,0.25)]`}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {c.label}
                    </p>
                    <p className="mt-1.5 font-heading text-xl font-semibold tracking-tight text-foreground">
                      {c.display}
                    </p>
                    <p className="mt-3 flex-1 text-[13px] leading-relaxed text-muted-foreground">
                      {c.description}
                    </p>
                    <a
                      href={c.href}
                      target={c.external ? "_blank" : undefined}
                      rel={c.external ? "noopener noreferrer" : undefined}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition hover:text-primary"
                    >
                      {c.cta}
                      {c.external ? (
                        <ExternalLink className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowRight className="h-3.5 w-3.5" />
                      )}
                    </a>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── Location + Hours ─────────────────────────────────── */}
      <section className="border-t border-border/40 bg-accent/30 py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">

            {/* Showroom address */}
            <Reveal variant="clip">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
                  Our showroom
                </p>
                <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  Visit us in Karachi
                </h2>
                <div className="mt-6 flex gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-[15px] leading-relaxed text-foreground/80">
                    {BRAND.address}
                  </p>
                </div>

                <a
                  href={MAP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-foreground/20 hover:bg-background"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open in Google Maps
                </a>

                {/* Contacts */}
                <div className="mt-8 space-y-3">
                  {BRAND.contacts.map((c) => (
                    <div key={c.phone} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/8">
                        <Phone className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <a
                        href={telUrl(c.tel)}
                        className="text-[14px] font-medium text-foreground/80 transition hover:text-foreground"
                      >
                        {c.phone}
                        <span className="ml-2 text-muted-foreground">— {c.name}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Business hours */}
            <Reveal variant="fade" delay={0.06}>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
                  Business hours
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <p className="text-[13px] font-medium text-green-700">
                    Usually open now
                  </p>
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-border/50 bg-card">
                  {HOURS.map((h, i) => (
                    <div
                      key={h.day}
                      className={`flex items-start justify-between gap-4 px-5 py-4 ${
                        i < HOURS.length - 1 ? "border-b border-border/40" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                        <span className="text-[13px] font-medium text-foreground">
                          {h.day}
                        </span>
                      </div>
                      <span className="text-right text-[13px] text-muted-foreground">
                        {h.hours}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-[12px] text-muted-foreground">
                  WhatsApp is monitored outside business hours for urgent
                  inquiries. Response time may be longer.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ── Dealer CTA ───────────────────────────────────────── */}
      <section className="overflow-hidden bg-[#0d1526] py-16 text-white">
        <Container>
          <Reveal variant="fade">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/35">
                  For trade & wholesale
                </p>
                <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                  Dealer inquiries welcome.
                </h2>
                <p className="mt-2 max-w-sm text-[14px] text-white/50">
                  Competitive wholesale rates, reliable supply, and direct brand support.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/become-a-dealer"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-dark transition hover:bg-white/90"
                >
                  Become a dealer
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={whatsappUrl("I'd like to enquire about wholesale / dealer rates.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/12"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp wholesale
                </a>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </main>
  );
}
