import Link from "next/link";
import { ArrowLeft, Search, Package, MessageCircle } from "lucide-react";
import { Container } from "@/components/layout/container";
import { whatsappUrl } from "@/lib/brand";

const LINKS = [
  { href: "/products", label: "Browse all products", icon: Package },
  { href: "/contact", label: "Contact us", icon: MessageCircle },
];

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background pt-[72px]">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 40%, rgba(34,211,238,0.05), transparent 60%)",
        }}
      />

      <Container className="relative py-24 text-center">
        {/* Large ghosted 404 */}
        <div className="relative mx-auto mb-8 w-fit">
          <span
            className="select-none font-heading text-[clamp(7rem,22vw,14rem)] font-bold leading-none tracking-[-0.06em] text-foreground/5"
            aria-hidden
          >
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border/50 bg-card shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12)]">
              <Search className="h-7 w-7 text-muted-foreground/40" />
            </div>
          </div>
        </div>

        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          This page doesn&apos;t exist.
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
          It may have moved, been renamed, or simply never existed.
          <br className="hidden sm:block" />
          Let us help you find what you need.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to homepage
          </Link>
          <a
            href={whatsappUrl(
              "I got a 404 error on your website and need help.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#22c55e]"
          >
            <MessageCircle className="h-4 w-4" />
            Ask on WhatsApp
          </a>
        </div>

        <div className="mt-14 border-t border-border/40 pt-10">
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            You might be looking for
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground/70 transition hover:border-foreground/20 hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
