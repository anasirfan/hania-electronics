import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Phone, MapPin, Share2 } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { BRAND, telUrl, whatsappUrl } from "@/lib/brand";

const columns = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Why Hania", href: "#why" },
      { label: "Trusted Across Pakistan", href: "#trusted" },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "All Products", href: "/products" },
      { label: "Best Sellers", href: "#bestsellers" },
      { label: "Shop by Purpose", href: "#purpose" },
      { label: "Featured", href: "#featured" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Track Order", href: "/track-order" },
      { label: "WhatsApp Help", href: whatsappUrl() },
    ],
  },
  {
    title: "Dealer",
    links: [
      { label: "Become a Dealer", href: "/become-a-dealer" },
      { label: "Wholesale Inquiry", href: whatsappUrl("I want wholesale rates.") },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-dark text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,0.18),transparent_45%),radial-gradient(ellipse_at_bottom_left,rgba(11,107,203,0.2),transparent_40%)]"
      />
      <Container className="relative py-20">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-glow">
                  {col.title}
                </p>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/70 transition hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-glow">
                Contact
              </p>
              <ul className="space-y-3 text-sm text-white/70">
                {BRAND.contacts.map((c) => (
                  <li key={c.phone}>
                    <a
                      href={telUrl(c.tel)}
                      className="transition hover:text-white"
                    >
                      {c.phone} — {c.name}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={telUrl(BRAND.phones.landline)}
                    className="transition hover:text-white"
                  >
                    {BRAND.phones.landlineDisplay}
                  </a>
                </li>
                <li className="flex gap-2 pt-1">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-glow" />
                  <span>{BRAND.address}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-[28px] border border-white/10 bg-white/5 p-8 backdrop-blur-md lg:min-h-[320px]">
            <div>
              <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-[0_0_40px_-5px_rgba(34,211,238,0.6)]">
                <Image
                  src="/brand/logo-mark-transparent.webp"
                  alt="Hania Electronics"
                  fill
                  className="object-contain p-3"
                />
              </div>
              <p className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                {BRAND.name}
              </p>
              <p className="mt-3 max-w-sm text-lg text-white/70">
                Lighting That Powers Every Moment.
              </p>
              <p className="mt-2 text-sm uppercase tracking-[0.18em] text-primary-glow">
                {BRAND.tagline}
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="whatsapp" asChild>
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle /> WhatsApp
                </a>
              </Button>
              <Button variant="dark" asChild>
                <a href={telUrl(BRAND.phones.primary)}>
                  <Phone /> Call
                </a>
              </Button>
              <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10" asChild>
                <a
                  href={BRAND.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Share2 /> Facebook
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-8 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <p>Wholesale & Retail · Karachi · Delivery across Pakistan</p>
        </div>
      </Container>
    </footer>
  );
}
