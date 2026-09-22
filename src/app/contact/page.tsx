import Link from "next/link";
import Image from "next/image";
import {
  MessageCircle,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  ExternalLink,
  Mail,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { telUrl } from "@/lib/brand";
import { mediaUrl } from "@/lib/media-url";
import { whatsappUrlFrom } from "@/lib/site-settings";
import { siteSettingsRepository } from "@/server/repositories";

export const metadata = {
  title: "Contact — HANIA Electronics",
  description:
    "Get in touch with HANIA Electronics. WhatsApp, call, or visit our showroom in Karachi's Boulton Market.",
};

export default async function ContactPage() {
  const settings = await siteSettingsRepository.get();
  const wa = (msg?: string) => whatsappUrlFrom(settings, msg);

  const contactCards = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      display: settings.whatsapp.startsWith("0")
        ? `+92 ${settings.whatsapp.slice(1)}`
        : settings.whatsapp,
      href: wa("Assalam o Alaikum! I'd like to enquire about your products."),
      description:
        "Fastest response — typically under 5 minutes during business hours.",
      cta: "Chat on WhatsApp",
      color: "bg-[#25D366]",
      external: true,
    },
    {
      icon: Phone,
      label: "Phone",
      display: settings.phonePrimaryDisplay,
      href: telUrl(settings.phonePrimary),
      description:
        "Speak directly with our team about products, orders, or wholesale rates.",
      cta: "Call now",
      color: "bg-primary",
      external: false,
    },
    {
      icon: Phone,
      label: "Landline",
      display: settings.phoneLandlineDisplay,
      href: telUrl(settings.phoneLandline),
      description: "Office line — open during regular business hours.",
      cta: "Call office",
      color: "bg-secondary",
      external: false,
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <section className="relative isolate min-h-[420px] overflow-hidden text-white sm:min-h-[460px] md:min-h-[520px]">
        <Image
          src={mediaUrl("/media/brand/dealer-bg.webp")}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[#050A1F] via-[#050A1F]/75 to-[#050A1F]/45"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[#0B6BCB]/20 mix-blend-multiply"
        />

        <Container className="relative flex min-h-[420px] flex-col justify-end pb-10 pt-28 sm:min-h-[460px] sm:pb-14 md:min-h-[520px] md:pb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
            Contact HANIA
          </p>
          <h1 className="mt-3 max-w-xl font-heading text-[clamp(2.1rem,7vw,3.6rem)] font-semibold leading-[1.05] tracking-tight text-white">
            We&apos;re in Karachi.
            <span className="mt-1 block text-[#7DD3FC]">We answer fast.</span>
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80 sm:text-[15px]">
            WhatsApp is the fastest way to reach us. A real person responds —
            no bots, no queues, no ticket numbers.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-xl bg-[#25D366] px-6 text-white hover:bg-[#1ebe57]"
            >
              <a
                href={wa(
                  "Assalam o Alaikum! I'd like to enquire about your products.",
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp us
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-xl border-white/30 bg-white/10 px-6 text-white backdrop-blur hover:bg-white/20 hover:text-white"
            >
              <a href={telUrl(settings.phonePrimary)}>
                <Phone className="h-4 w-4" />
                Call {settings.phonePrimaryDisplay}
              </a>
            </Button>
          </div>
        </Container>
      </section>

      <section className="bg-background py-16 md:py-24">
        <Container>
          <div className="grid gap-5 md:grid-cols-3">
            {contactCards.map((c, i) => {
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

          {settings.email ? (
            <div className="mt-6 flex justify-center">
              <a
                href={`mailto:${settings.email}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground hover:border-primary/30"
              >
                <Mail className="h-4 w-4 text-primary" />
                {settings.email}
              </a>
            </div>
          ) : null}
        </Container>
      </section>

      <section className="border-t border-border/40 bg-accent/30 py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
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
                    {settings.address}
                  </p>
                </div>

                <a
                  href={settings.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-foreground/20 hover:bg-background"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open in Google Maps
                </a>

                <div className="mt-8 space-y-3">
                  {settings.contacts.map((c) => (
                    <div key={c.phone + c.name} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/8">
                        <Phone className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <a
                        href={telUrl(c.tel)}
                        className="text-[14px] font-medium text-foreground/80 transition hover:text-foreground"
                      >
                        {c.phone}
                        <span className="ml-2 text-muted-foreground">
                          — {c.name}
                        </span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

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
                  {settings.businessHours.map((h, i) => (
                    <div
                      key={h.day}
                      className={`flex items-start justify-between gap-4 px-5 py-4 ${
                        i < settings.businessHours.length - 1
                          ? "border-b border-border/40"
                          : ""
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

      <section className="overflow-hidden bg-[#0d1526] py-16 text-white">
        <Container>
          <Reveal variant="fade">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/35">
                  For trade & wholesale
                </p>
                <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Dealer inquiries welcome.
                </h2>
                <p className="mt-2 max-w-sm text-[14px] text-white/50">
                  Competitive wholesale rates, reliable supply, and direct brand
                  support.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/become-a-dealer"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0B1220] transition hover:bg-white/90"
                >
                  Become a dealer
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={wa(
                    "I'd like to enquire about wholesale / dealer rates.",
                  )}
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
