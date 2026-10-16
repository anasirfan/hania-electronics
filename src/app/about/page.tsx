import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { CinematicImage } from "@/components/media/cinematic-image";
import { media } from "@/data/catalog/media";
import { mediaUrl } from "@/lib/media-url";
import { telUrl } from "@/lib/brand";
import { whatsappUrlFrom } from "@/lib/site-settings";
import {
  aboutContentRepository,
  siteSettingsRepository,
} from "@/server/repositories";
import { MessageCircle, MapPin, Phone, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const about = await aboutContentRepository.get();
  return {
    title: about.metaTitle,
    description: about.metaDescription,
  };
}

/** Render "line one\nline two" with <br /> between lines. */
function Lines({ text }: { text: string }) {
  const parts = text.split(/\r?\n/).filter((p, i, arr) => p !== "" || i < arr.length - 1);
  return (
    <>
      {parts.map((line, i) => (
        <span key={i}>
          {line}
          {i < parts.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

export default async function AboutPage() {
  const [about, settings] = await Promise.all([
    aboutContentRepository.get(),
    siteSettingsRepository.get(),
  ]);

  const storeName = settings.storeName;

  return (
    <main className="min-h-screen bg-background pt-[72px]">

      {/* ── Hero ── */}
      <section className="relative min-h-[75vh] overflow-hidden bg-[#0d1526] text-white">
        <CinematicImage
          src={media.hero}
          alt="Warm pendant light in a quiet bedroom"
          fill
          priority
          grade="warm"
          containerClassName="absolute inset-0"
          className="object-[42%_22%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <Container className="relative flex min-h-[75vh] flex-col justify-end pb-20 pt-32">
          <Reveal variant="fade">
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/35">
              {about.heroEyebrow}
            </p>
          </Reveal>
          <Reveal variant="slide" delay={0.12}>
            <h1 className="font-heading text-[clamp(2.4rem,6vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-white">
              <Lines text={about.heroTitle} />
            </h1>
          </Reveal>
          <Reveal variant="blur" delay={0.15}>
            <p className="mt-6 max-w-[400px] text-[15px] leading-[1.7] text-white/60">
              {about.heroBody}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ── Stats bar ── */}
      {about.stats.length > 0 && (
        <section className="bg-[#080d18] py-12 text-white">
          <Container>
            <dl className="grid grid-cols-2 gap-y-10 lg:grid-cols-4">
              {about.stats.map((s, i) => (
                <Reveal key={`${s.label}-${i}`} variant="fade" delay={i * 0.06}>
                  <div className="text-center">
                    <dt className="font-heading text-[clamp(2rem,4vw,2.75rem)] font-bold tracking-[-0.04em] text-white">
                      {s.value}
                    </dt>
                    <dd className="mt-1.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/35">
                      {s.label}
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </Container>
        </section>
      )}

      {/* ── Brand story ── */}
      <section className="relative bg-[#05070c] py-24 text-white md:py-36">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_0%,rgba(34,211,238,0.07),transparent_55%)]"
        />
        <Container>
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            <div>
              <Reveal variant="fade">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/30">
                  {about.storyEyebrow}
                </p>
              </Reveal>
              <Reveal variant="mask">
                <h2 className="mt-4 font-heading text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-white sm:text-4xl">
                  <Lines text={about.storyTitle} />
                </h2>
              </Reveal>
              <Reveal variant="blur" delay={0.1}>
                <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-white/50">
                  {about.storyParagraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Logo + contact card */}
            <Reveal variant="clip">
              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-8 backdrop-blur-md">
                <div className="relative mb-6 h-20 w-20 overflow-hidden rounded-2xl bg-white">
                  <Image
                    src={mediaUrl("/brand/logo-mark-v2.webp")}
                    alt={storeName}
                    fill
                    className="object-contain p-3"
                  />
                </div>
                <p className="font-heading text-2xl font-semibold text-white">
                  {storeName}
                </p>
                <p className="mt-2 text-sm text-white/50">{settings.tagline}</p>

                <div className="mt-8 space-y-4 text-sm text-white/55">
                  <div className="flex gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-glow" />
                    <span>{settings.address}</span>
                  </div>
                  {settings.contacts.map((c) => (
                    <div key={`${c.tel}-${c.name}`} className="flex gap-3">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary-glow" />
                      <a
                        href={telUrl(c.tel)}
                        className="transition hover:text-white"
                      >
                        {c.phone} — {c.name}
                      </a>
                    </div>
                  ))}
                </div>

                <a
                  href={whatsappUrlFrom(
                    settings,
                    `Assalam o Alaikum! I want to know more about ${storeName}.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#22c55e]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat with us
                </a>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ── Timeline ── */}
      {about.timeline.length > 0 && (
        <section className="bg-background py-24 md:py-36">
          <Container>
            <div className="mx-auto max-w-3xl">
              <Reveal variant="fade">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  {about.timelineEyebrow}
                </p>
              </Reveal>
              <Reveal variant="mask" delay={0.04}>
                <h2 className="mt-4 font-heading text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-foreground sm:text-4xl">
                  <Lines text={about.timelineTitle} />
                </h2>
              </Reveal>

              <div className="mt-14 space-y-0">
                {about.timeline.map((item, i) => (
                  <Reveal key={`${item.year}-${i}`} variant="slide" delay={i * 0.06}>
                    <div className="flex gap-6">
                      <div className="flex flex-col items-center">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/8">
                          <span className="font-heading text-[10px] font-bold text-primary tabular-nums">
                            {item.year.slice(-2)}
                          </span>
                        </div>
                        {i < about.timeline.length - 1 && (
                          <div className="mt-1.5 w-px flex-1 bg-border/60" style={{ minHeight: 44 }} />
                        )}
                      </div>

                      <div className="pb-10 pt-1">
                        <span className="font-heading text-[11px] font-bold tabular-nums tracking-[0.15em] text-primary">
                          {item.year}
                        </span>
                        <h3 className="mt-1 font-heading text-[18px] font-semibold tracking-tight text-foreground">
                          {item.title}
                        </h3>
                        <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ── Values ── */}
      {about.values.length > 0 && (
        <section className="bg-[#080d18] py-24 text-white md:py-36">
          <Container>
            <Reveal variant="fade">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/30">
                {about.valuesEyebrow}
              </p>
            </Reveal>
            <Reveal variant="mask">
              <h2 className="mt-4 font-heading text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-white sm:text-4xl">
                <Lines text={about.valuesTitle} />
              </h2>
            </Reveal>

            <div className="mt-16 border-t border-white/10">
              {about.values.map((v, i) => (
                <Reveal key={`${v.title}-${i}`} variant="slide" delay={i * 0.07}>
                  <div className="flex flex-col gap-3 border-b border-white/10 py-8 sm:flex-row sm:items-baseline sm:gap-12">
                    <span className="shrink-0 font-heading text-[11px] tabular-nums tracking-[0.2em] text-white/20 sm:w-12">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="flex-1 font-heading text-xl font-semibold tracking-tight text-white sm:text-2xl">
                      {v.title}
                    </h3>
                    <p className="max-w-xs text-sm leading-relaxed text-white/40">
                      {v.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ── Pakistan network ── */}
      <section className="bg-background py-24 md:py-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <Reveal variant="fade">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  {about.reachEyebrow}
                </p>
              </Reveal>
              <Reveal variant="mask" delay={0.04}>
                <h2 className="mt-4 font-heading text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-foreground sm:text-4xl">
                  <Lines text={about.reachTitle} />
                </h2>
              </Reveal>
              <Reveal variant="blur" delay={0.08}>
                <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
                  {about.reachBody}
                </p>
              </Reveal>
              <Reveal variant="fade" delay={0.1}>
                <Link
                  href="/become-a-dealer"
                  className="mt-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:border-foreground/20"
                >
                  Become a dealer
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Reveal>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {about.network.map((n, i) => (
                <Reveal key={`${n.city}-${i}`} variant="scale" delay={i * 0.04}>
                  <div
                    className={`rounded-2xl border p-4 ${
                      n.primary
                        ? "border-primary/30 bg-primary/5"
                        : "border-border/50 bg-card"
                    }`}
                  >
                    <div
                      className={`mb-2 h-2 w-2 rounded-full ${
                        n.primary ? "bg-primary" : "bg-border"
                      }`}
                    />
                    <p className="font-heading text-[14px] font-semibold text-foreground">
                      {n.city}
                    </p>
                    <p className="mt-0.5 text-[12px] leading-snug text-muted-foreground">
                      {n.role}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── CTA strip ── */}
      <section className="bg-accent/40 border-t border-border/40 py-16 md:py-20">
        <Container>
          <Reveal variant="fade">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                  {about.ctaTitle}
                </h2>
                <p className="mt-2 text-muted-foreground">{about.ctaBody}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={whatsappUrlFrom(settings)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#22c55e]"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
                <Link
                  href="/products"
                  className="inline-flex items-center rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:border-foreground/20"
                >
                  Browse products
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </main>
  );
}
