"use client";

import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Phone, MapPin, Share2 } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/components/layout/storefront-shell";
import { telUrl } from "@/lib/brand";
import { mediaUrl } from "@/lib/media-url";
import { whatsappUrlFrom } from "@/lib/site-settings";

export function Footer() {
  const settings = useSiteSettings();
  const wa = (msg?: string) => whatsappUrlFrom(settings, msg);

  const columns = [
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "FAQ", href: "/faq" },
      ],
    },
    {
      title: "Shop",
      links: [
        { label: "All Products", href: "/shop" },
        { label: "Metal Lights", href: "/shop/metal-lights" },
        { label: "Flash Lights", href: "/shop/flash-lights" },
        { label: "Solar Lights", href: "/shop/solar-lights" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Track Order", href: "/track-order" },
        { label: "Wishlist", href: "/wishlist" },
        { label: "WhatsApp Help", href: wa() },
      ],
    },
    {
      title: "Dealer",
      links: [
        { label: "Become a Dealer", href: "/become-a-dealer" },
        {
          label: "Wholesale Inquiry",
          href: wa("I want wholesale rates."),
        },
      ],
    },
  ];

  return (
    <footer className="relative z-[3] border-t border-border bg-[#050A1F] text-white">
      <Container className="py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="relative h-10 w-10 overflow-hidden rounded-xl bg-white">
                <Image
                  src={mediaUrl("/brand/logo-mark-transparent.webp")}
                  alt=""
                  fill
                  className="object-contain p-1.5"
                />
              </span>
              <span className="font-heading text-lg font-semibold">
                {settings.storeName.replace(/ELECTRONICS/i, "Electronics")}
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-white/65">
              {settings.supportLine ||
                "Premium lighting for Pakistani homes and businesses — metal, flash, and solar collections with cash on delivery."}
            </p>
            <div className="mt-5 space-y-2 text-sm text-white/70">
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                {settings.address}
              </p>
              {settings.email ? (
                <a
                  className="flex items-center gap-2 hover:text-white"
                  href={`mailto:${settings.email}`}
                >
                  {settings.email}
                </a>
              ) : null}
              <a
                className="flex items-center gap-2 hover:text-white"
                href={telUrl(settings.phonePrimary)}
              >
                <Phone className="h-4 w-4" />
                {settings.phonePrimaryDisplay}
              </a>
            </div>
            <div className="mt-5 flex gap-2">
              <Button size="sm" variant="whatsapp" asChild>
                <a href={wa()} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-white/20 bg-transparent text-white hover:bg-white/10"
                asChild
              >
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Share2 className="h-4 w-4" />
                  Facebook
                </a>
              </Button>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2">
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
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/45">
          <p>
            © {new Date().getFullYear()} {settings.storeName}. All rights
            reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
