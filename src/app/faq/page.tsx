"use client";

import * as React from "react";
import Link from "next/link";
import { Search, MessageCircle, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { whatsappUrl } from "@/lib/brand";
import { cn } from "@/lib/utils";

const FAQ_CATEGORIES = [
  {
    id: "ordering",
    label: "Ordering",
    faqs: [
      {
        q: "How do I place an order?",
        a: "All orders are placed through WhatsApp. Click any 'Order on WhatsApp' button on the product page — it opens a pre-filled chat with your selected product. Our team confirms availability, processes your order, and arranges delivery.",
      },
      {
        q: "Can I order without WhatsApp?",
        a: "Yes. You can call us directly on 0333-2326490 or 0331-2590323 during business hours, or visit our showroom at Falak Corporate City, Boulton Market, Karachi.",
      },
      {
        q: "Is there a minimum order quantity?",
        a: "No minimum for retail orders. Wholesale/dealer orders have a minimum that varies by product category — WhatsApp us for wholesale minimums.",
      },
      {
        q: "Do you offer Cash on Delivery (COD)?",
        a: "Yes. COD is available on most orders across Pakistan. Some remote areas may require advance payment — our team will confirm when processing your order.",
      },
    ],
  },
  {
    id: "delivery",
    label: "Delivery",
    faqs: [
      {
        q: "Which cities do you deliver to?",
        a: "We deliver across all major cities and towns in Pakistan — including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, and hundreds of smaller towns via courier.",
      },
      {
        q: "How long does delivery take?",
        a: "2–5 working days for most cities. Karachi orders may arrive in 1–2 days. Remote areas can take 5–7 days. You'll receive tracking information once your order is dispatched.",
      },
      {
        q: "How much is the delivery charge?",
        a: "Delivery charges vary by courier and location. Our team shares the delivery cost when confirming your order. For large wholesale orders, we often arrange preferential courier rates.",
      },
      {
        q: "How do I track my order?",
        a: "Once dispatched, we send you the courier tracking number via WhatsApp. You can track it directly on the courier's website. You can also use our Track Order page.",
      },
    ],
  },
  {
    id: "products",
    label: "Products",
    faqs: [
      {
        q: "Are all products genuine?",
        a: "Yes. We do not stock imitations or counterfeits. Every product in our catalog is sourced directly and carries the brand warranty stated on the product page.",
      },
      {
        q: "What warranty do your products carry?",
        a: "Warranty varies by product: 6 months for most lighting products, 1 year for solar products and industrial-grade items. The specific warranty is listed on each product page.",
      },
      {
        q: "What if my product has a defect?",
        a: "WhatsApp our support team with your order details and a photo or video of the issue. If it's a manufacturing defect within the warranty period, we replace or repair at no charge.",
      },
      {
        q: "Can I return a product if I change my mind?",
        a: "We accept returns within 3 days of delivery, provided the product is unused and in its original packaging. WhatsApp us to initiate a return.",
      },
    ],
  },
  {
    id: "wholesale",
    label: "Wholesale",
    faqs: [
      {
        q: "Do you offer wholesale / dealer rates?",
        a: "Yes. We have a full dealer programme with competitive wholesale pricing, volume discounts, and dedicated support. Visit our Become a Dealer page for details.",
      },
      {
        q: "How do I become a dealer?",
        a: "Fill out our dealer application form on the Become a Dealer page, or WhatsApp us directly to discuss rates. We onboard dealers across all cities.",
      },
      {
        q: "Is there a dealership fee?",
        a: "No upfront fee. We assess your order volume and business type. WhatsApp us to start the conversation.",
      },
      {
        q: "Do dealers get priority on stock?",
        a: "Yes. Registered dealers are prioritised during high-demand periods and are notified first when new products arrive.",
      },
    ],
  },
];

export default function FaqPage() {
  const [activeTab, setActiveTab] = React.useState("ordering");
  const [query, setQuery] = React.useState("");

  const allFaqs = FAQ_CATEGORIES.flatMap((c) =>
    c.faqs.map((f) => ({ ...f, category: c.id })),
  );

  const searchResults = query.trim()
    ? allFaqs.filter(
        (f) =>
          f.q.toLowerCase().includes(query.toLowerCase()) ||
          f.a.toLowerCase().includes(query.toLowerCase()),
      )
    : null;

  const displayFaqs =
    searchResults ?? FAQ_CATEGORIES.find((c) => c.id === activeTab)?.faqs ?? [];

  return (
    <main className="min-h-screen bg-background">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#05070c] pt-[72px] text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(34,211,238,0.07), transparent 55%)",
          }}
        />
        <Container className="relative py-16 md:py-24">
          <Reveal variant="fade">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/35">
              Help center
            </p>
          </Reveal>
          <Reveal variant="slide" delay={0.05}>
            <h1 className="mt-4 font-heading text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.06] tracking-[-0.04em]">
              Frequently asked questions.
            </h1>
          </Reveal>

          {/* Search */}
          <Reveal variant="blur" delay={0.1}>
            <div className="relative mt-8 max-w-lg">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Search questions…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-14 w-full rounded-2xl border border-white/10 bg-white/8 pl-12 pr-5 text-[15px] text-white placeholder:text-white/30 backdrop-blur-md focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── FAQ Content ───────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <Container>
          {!searchResults && (
            <Reveal variant="fade">
              <div className="mb-10 flex flex-wrap gap-2">
                {FAQ_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    className={cn(
                      "rounded-full px-5 py-2.5 text-sm font-medium transition",
                      activeTab === cat.id
                        ? "bg-foreground text-background"
                        : "bg-foreground/8 text-foreground/65 hover:bg-foreground/12",
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </Reveal>
          )}

          {searchResults && (
            <div className="mb-8">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {searchResults.length}
                </span>{" "}
                result{searchResults.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
              </p>
            </div>
          )}

          <div className="mx-auto max-w-2xl divide-y divide-border/50">
            {displayFaqs.length > 0 ? (
              displayFaqs.map((faq, i) => <FaqRow key={i} q={faq.q} a={faq.a} />)
            ) : (
              <div className="py-16 text-center">
                <p className="font-heading text-lg font-semibold text-foreground">
                  No results found
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try a different search or ask us on WhatsApp.
                </p>
              </div>
            )}
          </div>

          {/* Still have questions */}
          <Reveal variant="fade" delay={0.1}>
            <div className="mx-auto mt-16 max-w-2xl rounded-[24px] border border-border/50 bg-card p-8 text-center">
              <p className="font-heading text-xl font-semibold text-foreground">
                Still have questions?
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Our team answers on WhatsApp — usually within minutes.
              </p>
              <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <a
                  href={whatsappUrl(
                    "Assalam o Alaikum! I have a question about your products.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#22c55e]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Ask on WhatsApp
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:border-foreground/20"
                >
                  View all contact options
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </main>
  );
}

function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="py-5">
      <button
        className="flex w-full items-start justify-between gap-4 text-left"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="font-heading text-[15px] font-medium leading-snug text-foreground">
          {q}
        </span>
        <span
          className={cn(
            "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-sm font-medium text-muted-foreground transition",
            open && "bg-foreground text-background",
          )}
        >
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
          {a}
        </p>
      )}
    </div>
  );
}
