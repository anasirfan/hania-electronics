import Link from "next/link";
import { Container } from "@/components/layout/container";
import { BRAND } from "@/lib/brand";

export const metadata = {
  title: "Terms of Service — HANIA Electronics",
  description: "Terms and conditions for purchasing from HANIA Electronics.",
};

const SECTIONS = [
  {
    id: "overview",
    title: "Overview",
    content: `These Terms of Service govern your use of the HANIA Electronics website and your purchases from us. By placing an order or using our website, you agree to these terms.

HANIA Electronics (operating from Falak Corporate City, Boulton Market, Karachi) is a retail and wholesale electronics business. We sell lighting products and accessories directly to consumers and to registered dealers.`,
  },
  {
    id: "orders",
    title: "Orders & pricing",
    content: `Orders are processed via WhatsApp, phone, or in-person at our showroom. An order is confirmed only after verbal or written confirmation from our team.

Prices displayed on our website are indicative and may vary. The price applicable to your order is the price confirmed by our team at the time of order placement.

We reserve the right to cancel or modify any order in the event of a pricing error, stock unavailability, or other unforeseen circumstances. In such cases, we will notify you and provide a full refund if payment has already been made.`,
  },
  {
    id: "payment",
    title: "Payment",
    content: `We accept Cash on Delivery (COD) for most orders within Pakistan. For wholesale or large-volume orders, advance payment via bank transfer may be required.

We do not accept credit or debit cards through our website. Any payment arrangement is made directly with our team.

For COD orders, payment is due at the time of delivery. Refusal to accept a confirmed order at delivery may result in the customer being responsible for return courier charges.`,
  },
  {
    id: "delivery",
    title: "Delivery",
    content: `We deliver across Pakistan via third-party courier services. Estimated delivery times are 2–5 working days for major cities and up to 7 days for remote areas. These are estimates — not guarantees.

Delivery charges, if applicable, are communicated at order confirmation. HANIA Electronics is not liable for delays caused by the courier service, natural events, or circumstances outside our control.

Risk of loss or damage passes to you upon delivery. Please inspect your package at delivery and raise any concerns immediately.`,
  },
  {
    id: "returns",
    title: "Returns & exchanges",
    content: `We accept returns within 3 days of delivery, provided the product is:
• Unused and in its original packaging
• Free of physical damage not caused by us
• Accompanied by proof of purchase (order reference or WhatsApp chat)

To initiate a return, contact us via WhatsApp with your order details and reason for return. Return shipping costs are the customer's responsibility unless the return is due to a defect or error on our part.

Items that are used, damaged after delivery, or returned after 3 days are not eligible for a full refund.`,
  },
  {
    id: "warranty",
    title: "Warranty",
    content: `Warranty periods are specified on individual product pages. Standard warranty is 6 months for most products and 1 year for solar and industrial products.

Warranty covers manufacturing defects. It does not cover:
• Physical damage due to misuse, drops, or water exposure beyond the product's rating
• Normal wear and tear
• Damage caused by use with non-standard accessories or power sources

To make a warranty claim, WhatsApp us with your order details, proof of purchase, and a photo or video of the defect.`,
  },
  {
    id: "dealer",
    title: "Dealer programme",
    content: `Wholesale and dealer pricing is available to registered dealers. Dealer status is granted at our discretion based on order volume, business type, and geographic location.

Dealers are bound by these terms in addition to any separate dealer agreement. Misrepresentation of dealer status or order volume may result in termination of the dealer relationship.`,
  },
  {
    id: "liability",
    title: "Limitation of liability",
    content: `To the maximum extent permitted by Pakistani law, HANIA Electronics' liability for any claim arising from these terms or your use of our products is limited to the amount you paid for the relevant product.

We are not liable for any indirect, incidental, consequential, or punitive damages, including loss of profits, data, or goodwill.`,
  },
  {
    id: "governing-law",
    title: "Governing law",
    content: `These terms are governed by and construed in accordance with the laws of Pakistan. Any disputes arising under these terms are subject to the jurisdiction of the courts of Karachi, Pakistan.`,
  },
  {
    id: "changes",
    title: "Changes to these terms",
    content: `We reserve the right to update these terms at any time. Updated terms will be posted on this page with a revised date. Your continued use of our website or services after any changes constitutes acceptance of the updated terms.`,
  },
];

export default function TermsPage() {
  const today = new Date().toLocaleDateString("en-PK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen bg-background pt-[72px]">
      {/* Header */}
      <section className="border-b border-border/40 bg-accent/30 py-12 md:py-16">
        <Container className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Legal
          </p>
          <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: {today} · {BRAND.name}
          </p>
          <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-muted-foreground">
            Please read these terms carefully before using our website or placing
            an order. By using HANIA Electronics services, you agree to be bound
            by these terms.
          </p>
        </Container>
      </section>

      {/* Content */}
      <Container className="max-w-3xl py-12 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[200px_1fr] lg:gap-16">
          {/* Table of contents */}
          <nav className="hidden lg:block">
            <div className="sticky top-[96px]">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Contents
              </p>
              <ul className="space-y-2">
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="block text-[13px] text-muted-foreground transition hover:text-foreground"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Body */}
          <div className="space-y-10">
            {SECTIONS.map((s) => (
              <section key={s.id} id={s.id}>
                <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
                  {s.title}
                </h2>
                <div className="mt-3 whitespace-pre-line text-[14px] leading-relaxed text-muted-foreground">
                  {s.content}
                </div>
              </section>
            ))}

            <section className="rounded-2xl border border-border/50 bg-card p-6">
              <h2 className="font-heading text-base font-semibold text-foreground">
                Questions about these terms?
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                Contact us via WhatsApp at{" "}
                <a
                  href={`https://wa.me/92${BRAND.phones.whatsapp.slice(1)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground"
                >
                  {BRAND.phones.whatsapp}
                </a>{" "}
                or call{" "}
                <a
                  href={`tel:${BRAND.phones.primary}`}
                  className="font-medium text-foreground"
                >
                  {BRAND.phones.primaryDisplay}
                </a>
                .
              </p>
            </section>

            <div className="flex gap-3 text-sm">
              <Link
                href="/privacy"
                className="text-muted-foreground underline decoration-border underline-offset-2 transition hover:text-foreground"
              >
                Privacy Policy
              </Link>
              <span className="text-border">·</span>
              <Link
                href="/contact"
                className="text-muted-foreground underline decoration-border underline-offset-2 transition hover:text-foreground"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
