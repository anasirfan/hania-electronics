"use client";

import * as React from "react";
import {
  Package,
  PackageSearch,
  MessageCircle,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { whatsappUrl } from "@/lib/brand";

const STEPS = [
  {
    icon: CheckCircle2,
    label: "Order Confirmed",
    description: "Your order is received and being processed.",
  },
  {
    icon: Package,
    label: "Packed & Dispatched",
    description: "Your item is packed and handed to the courier.",
  },
  {
    icon: Truck,
    label: "In Transit",
    description: "Your order is on its way to you.",
  },
  {
    icon: MapPin,
    label: "Out for Delivery",
    description: "Your order is with the delivery agent.",
  },
  {
    icon: CheckCircle2,
    label: "Delivered",
    description: "Your order has been delivered.",
  },
];

export default function TrackOrderPage() {
  const [orderId, setOrderId] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!orderId.trim() || !phone.trim()) return;

    const message = `Assalam o Alaikum! I'd like to track my order.\n\nOrder ID: ${orderId}\nPhone Number: ${phone}`;
    const url = whatsappUrl(message);

    setSubmitted(true);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="min-h-screen bg-background">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#05070c] pt-[72px] text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 50% 0%, rgba(34,211,238,0.07), transparent 55%)",
          }}
        />
        <Container className="relative py-16 md:py-24">
          <Reveal variant="fade">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/35">
              Order status
            </p>
          </Reveal>
          <Reveal variant="slide" delay={0.05}>
            <h1 className="mt-4 font-heading text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.06] tracking-[-0.04em]">
              Track your order.
            </h1>
          </Reveal>
          <Reveal variant="blur" delay={0.09}>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/45">
              Enter your order ID and phone number to get a status update
              via WhatsApp from our team.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ── Track form ───────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-md">
            <Reveal variant="scale">
              {!submitted ? (
                <form
                  onSubmit={handleSubmit}
                  className="rounded-[28px] border border-border/50 bg-card p-8 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)]"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/8">
                    <PackageSearch className="h-7 w-7 text-primary" />
                  </div>

                  <h2 className="font-heading text-xl font-semibold text-foreground">
                    Track your order
                  </h2>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    We&apos;ll connect you with our team on WhatsApp for a live
                    status update.
                  </p>

                  <div className="mt-8 space-y-4">
                    <div>
                      <label
                        htmlFor="orderId"
                        className="mb-1.5 block text-[13px] font-medium text-foreground"
                      >
                        Order ID
                      </label>
                      <input
                        id="orderId"
                        type="text"
                        placeholder="e.g. HE-20240001"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        required
                        className="h-12 w-full rounded-xl border border-border bg-background px-4 text-[14px] text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-1.5 block text-[13px] font-medium text-foreground"
                      >
                        Phone number
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        placeholder="03xx-xxxxxxx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="h-12 w-full rounded-xl border border-border bg-background px-4 text-[14px] text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-[#25D366] text-[14px] font-semibold text-white shadow-[0_4px_20px_-4px_rgba(37,211,102,0.4)] transition hover:bg-[#22c55e]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Track on WhatsApp
                  </button>

                  <p className="mt-4 text-center text-[12px] text-muted-foreground">
                    Don&apos;t have your Order ID?{" "}
                    <a
                      href={whatsappUrl(
                        "Assalam o Alaikum! I need help tracking my order.",
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-foreground underline decoration-border underline-offset-2 transition hover:decoration-foreground"
                    >
                      Message us directly
                    </a>
                  </p>
                </form>
              ) : (
                <div className="rounded-[28px] border border-green-200 bg-green-50 p-8 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                    <MessageCircle className="h-7 w-7 text-green-600" />
                  </div>
                  <h2 className="font-heading text-xl font-semibold text-foreground">
                    WhatsApp opened
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Your tracking request has been sent to WhatsApp. Our team
                    will respond with your order status shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition hover:border-foreground/20"
                  >
                    Track another order
                  </button>
                </div>
              )}
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ── Order journey ─────────────────────────────────────── */}
      <section className="border-t border-border/40 bg-accent/30 py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-2xl">
            <Reveal variant="fade">
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
                How it works
              </p>
            </Reveal>
            <Reveal variant="mask" delay={0.04}>
              <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Your order&apos;s journey.
              </h2>
            </Reveal>

            <div className="mt-10 space-y-0">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <Reveal key={i} variant="slide" delay={i * 0.06}>
                    <div className="flex gap-5">
                      {/* Line + dot */}
                      <div className="flex flex-col items-center">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-border bg-card shadow-sm">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        {i < STEPS.length - 1 && (
                          <div className="mt-1 w-px flex-1 bg-border/60" style={{ minHeight: 28 }} />
                        )}
                      </div>
                      {/* Content */}
                      <div className="pb-7 pt-1.5">
                        <p className="font-heading text-[15px] font-semibold text-foreground">
                          {step.label}
                        </p>
                        <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* Help link */}
          <Reveal variant="fade" delay={0.15}>
            <div className="mx-auto mt-8 max-w-2xl">
              <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-card px-5 py-4">
                <Clock className="h-5 w-5 shrink-0 text-muted-foreground" />
                <p className="flex-1 text-[13px] text-muted-foreground">
                  Delivery typically takes 2–5 working days. For urgent orders,{" "}
                  <a
                    href={whatsappUrl("I have an urgent delivery enquiry.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground underline decoration-border underline-offset-2 transition hover:decoration-foreground"
                  >
                    contact us on WhatsApp.
                  </a>
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </main>
  );
}
