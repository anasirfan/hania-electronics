import Link from "next/link";
import { Container } from "@/components/layout/container";
import { BRAND } from "@/lib/brand";

export const metadata = {
  title: "Privacy Policy — HANIA Electronics",
  description: "How HANIA Electronics collects, uses, and protects your personal information.",
};

const SECTIONS = [
  {
    id: "information-we-collect",
    title: "Information we collect",
    content: `When you interact with HANIA Electronics — whether by browsing our website, placing an order via WhatsApp, or making a direct enquiry — we may collect the following types of information:

• Name and contact details (phone number, WhatsApp number)
• Delivery address and city
• Order details and transaction history
• Communications you initiate with us via WhatsApp or phone

We do not collect payment card information. All payments are handled via Cash on Delivery or bank transfer, arranged directly with our team.`,
  },
  {
    id: "how-we-use-it",
    title: "How we use your information",
    content: `We use the information we collect solely to operate our business and serve you. Specifically, we use it to:

• Process and fulfil your orders
• Communicate delivery updates and order status
• Respond to your enquiries and support requests
• Improve our product selection and service quality

We do not use your information for automated marketing, profiling, or third-party advertising. We do not sell, rent, or trade your personal information.`,
  },
  {
    id: "whatsapp-communications",
    title: "WhatsApp communications",
    content: `HANIA Electronics uses WhatsApp as its primary customer communication channel. When you message us on WhatsApp, your messages are subject to WhatsApp's own Privacy Policy in addition to ours.

We retain WhatsApp conversation history for order reference and customer service purposes. We do not share the content of your WhatsApp messages with third parties except where required by law.`,
  },
  {
    id: "data-sharing",
    title: "Data sharing",
    content: `We share your information only when necessary to fulfil your order:

• With courier companies to arrange delivery (name, address, phone number)
• With payment processors where bank transfer is arranged

All third-party service providers we work with are instructed to handle your data only for the specific purpose of fulfilling our service to you.`,
  },
  {
    id: "data-retention",
    title: "Data retention",
    content: `We retain your personal information for as long as necessary to provide our services and fulfil legal obligations. Order records are typically retained for a minimum of one year for warranty and dispute resolution purposes.

You may request deletion of your personal information by contacting us via WhatsApp or phone. We will action requests within 30 days where technically feasible and legally permissible.`,
  },
  {
    id: "your-rights",
    title: "Your rights",
    content: `You have the right to:

• Access the personal information we hold about you
• Correct inaccurate information
• Request deletion of your information
• Object to certain uses of your information

To exercise any of these rights, contact us via WhatsApp or phone. We do not have a formal data protection officer, but all requests are handled directly by our management team.`,
  },
  {
    id: "security",
    title: "Security",
    content: `We take reasonable measures to protect your personal information from unauthorised access, alteration, or disclosure. Customer data is stored on secured systems and access is restricted to employees who need it to serve you.

However, no method of electronic transmission or storage is 100% secure. We cannot guarantee absolute security but are committed to protecting your information to the best of our ability.`,
  },
  {
    id: "changes",
    title: "Changes to this policy",
    content: `We may update this Privacy Policy from time to time. When we do, we will revise the date at the top of this page. Continued use of our website or services after any changes constitutes acceptance of the updated policy.`,
  },
];

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: {today} · {BRAND.name}
          </p>
          <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-muted-foreground">
            This Privacy Policy explains how HANIA Electronics collects, uses,
            and protects information when you use our website or services.
          </p>
        </Container>
      </section>

      {/* Content */}
      <Container className="max-w-3xl py-12 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[200px_1fr] lg:gap-16">
          {/* Table of contents — desktop sidebar */}
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
                <div className="mt-3 space-y-3 whitespace-pre-line text-[14px] leading-relaxed text-muted-foreground">
                  {s.content}
                </div>
              </section>
            ))}

            {/* Contact */}
            <section className="rounded-2xl border border-border/50 bg-card p-6">
              <h2 className="font-heading text-base font-semibold text-foreground">
                Contact us about privacy
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                For any privacy-related questions or requests, contact us via
                WhatsApp at{" "}
                <a
                  href={`https://wa.me/92${BRAND.phones.whatsapp.slice(1)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground underline decoration-border underline-offset-2 transition hover:decoration-foreground"
                >
                  {BRAND.phones.whatsapp}
                </a>{" "}
                or by phone on{" "}
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
                href="/terms"
                className="text-muted-foreground underline decoration-border underline-offset-2 transition hover:text-foreground hover:decoration-foreground"
              >
                Terms of Service
              </Link>
              <span className="text-border">·</span>
              <Link
                href="/contact"
                className="text-muted-foreground underline decoration-border underline-offset-2 transition hover:text-foreground hover:decoration-foreground"
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
