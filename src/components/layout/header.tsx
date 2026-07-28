"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Phone,
  MessageCircle,
  Menu,
  PackageSearch,
  ChevronDown,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Container } from "@/components/layout/container";
import { SearchCommand } from "@/features/search/search-command";
import { DealerDialog } from "@/features/dealers/dealer-dialog";
import { TrackOrderDialog } from "@/features/orders/track-order-dialog";
import { categories } from "@/data/catalog/categories";
import { BRAND, telUrl, whatsappUrl } from "@/lib/brand";
import { cn } from "@/lib/utils";

const links = [
  { href: "/products", label: "All Products" },
  { href: "#bestsellers", label: "Best Sellers" },
  { href: "#purpose", label: "Shop by Purpose" },
  { href: "/become-a-dealer", label: "Become a Dealer" },
];

export function Header() {
  const [scrolled, setScrolled] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [dealerOpen, setDealerOpen] = React.useState(false);
  const [megaOpen, setMegaOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };

  const scheduleCloseMega = () => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 160);
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/95 shadow-sm backdrop-blur-xl border-b border-border text-foreground"
            : megaOpen
              ? "bg-[#0d1526]/90 backdrop-blur-xl text-white"
              : "bg-transparent text-white",
        )}
      >
        <Container className="relative">
          <div className="flex h-[72px] items-center justify-between gap-6">
            <Link href="/" className="flex items-center gap-3">
              <span
                data-header-logo=""
                className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white p-2"
              >
                <Image
                  src="/brand/logo-mark-transparent.webp"
                  alt="Hania Electronics"
                  fill
                  className="object-contain p-1.5"
                  priority
                />
              </span>
              <span className="font-heading text-[15px] font-semibold tracking-[-0.02em] sm:text-base">
                HANIA
                <span className="ml-1.5 font-normal opacity-70">Electronics</span>
              </span>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              <div
                className="relative"
                onMouseEnter={openMega}
                onMouseLeave={scheduleCloseMega}
              >
                <button
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-[14px] font-medium transition",
                    scrolled
                      ? "text-foreground/75 hover:bg-black/6 hover:text-foreground"
                      : "text-white/85 hover:bg-white/10 hover:text-white",
                    megaOpen && !scrolled && "bg-white/10 text-white",
                    megaOpen && scrolled && "bg-black/6 text-foreground",
                  )}
                  aria-expanded={megaOpen}
                >
                  Categories
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition",
                      megaOpen && "rotate-180",
                    )}
                  />
                </button>
              </div>

              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-[14px] font-medium transition",
                    scrolled
                      ? "text-foreground/75 hover:bg-black/6 hover:text-foreground"
                      : "text-white/80 hover:bg-white/10 hover:text-white",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className={cn(
                  "inline-flex h-10 w-10 items-center justify-center rounded-full transition",
                  scrolled
                    ? "text-foreground/80 hover:bg-black/6"
                    : "text-white hover:bg-white/10",
                )}
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>

              <TrackOrderDialog
                trigger={
                  <button
                    className={cn(
                      "hidden h-10 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium transition xl:inline-flex",
                      scrolled
                        ? "text-foreground/75 hover:bg-black/6"
                        : "text-white hover:bg-white/10",
                    )}
                  >
                    <PackageSearch className="h-4 w-4" />
                    Track
                  </button>
                }
              />

              <Button
                size="sm"
                variant="outline"
                className={cn(
                  "hidden h-10 rounded-full lg:inline-flex",
                  scrolled
                    ? "border-border bg-transparent text-foreground hover:bg-black/5"
                    : "border-white/20 bg-white/5 text-white hover:bg-white/15",
                )}
                onClick={() => setDealerOpen(true)}
              >
                Dealer
              </Button>

              <Button
                size="sm"
                variant="whatsapp"
                className="hidden h-10 rounded-full sm:inline-flex"
                asChild
              >
                <a
                  href={whatsappUrl(
                    "Assalam o Alaikum! I need help with lighting products.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </Button>

              <Button
                size="sm"
                className="hidden h-10 rounded-full bg-white text-dark hover:bg-white/90 md:inline-flex"
                asChild
              >
                <a href={telUrl(BRAND.phones.primary)}>
                  <Phone className="h-4 w-4" />
                  Call
                </a>
              </Button>

              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <button
                    className={cn(
                      "inline-flex h-10 w-10 items-center justify-center rounded-full lg:hidden",
                      scrolled
                        ? "bg-black/8 text-foreground"
                        : "bg-white/10 text-white",
                    )}
                    aria-label="Menu"
                  >
                    <Menu className="h-4 w-4" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full max-w-sm">
                  <SheetHeader>
                    <SheetTitle className="font-heading">HANIA Electronics</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <div>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Categories
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((cat) => (
                          <Link
                            key={cat.id}
                            href="#categories"
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2 rounded-xl border border-border p-2"
                          >
                            <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-gradient-to-b from-[#131f33] to-[#17253d]">
                              {cat.image ? (
                                <Image
                                  src={cat.image}
                                  alt=""
                                  fill
                                  className="object-cover"
                                />
                              ) : null}
                            </div>
                            <span className="text-sm font-medium">{cat.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      {links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className="rounded-xl px-3 py-3 text-sm font-medium hover:bg-accent"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                    <div className="grid gap-2">
                      <Button
                        onClick={() => {
                          setMobileOpen(false);
                          setDealerOpen(true);
                        }}
                      >
                        Become a Dealer
                      </Button>
                      <Button variant="whatsapp" asChild>
                        <a href={whatsappUrl()} target="_blank" rel="noreferrer">
                          WhatsApp
                        </a>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </Container>

        {/* Full megamenu */}
        <div
          className={cn(
            "absolute inset-x-0 top-full origin-top border-t border-white/8 bg-[#0d1526]/98 text-white shadow-2xl backdrop-blur-xl transition-all duration-200",
            megaOpen
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-1 opacity-0",
          )}
          onMouseEnter={openMega}
          onMouseLeave={scheduleCloseMega}
        >
          <Container className="py-8">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                  Shop by category
                </p>
                <p className="mt-1 font-heading text-2xl font-semibold tracking-tight text-white">
                  Find the right light
                </p>
              </div>
              <button
                className="rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white lg:hidden"
                onClick={() => setMegaOpen(false)}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href="#categories"
                  onClick={() => setMegaOpen(false)}
                  className="group overflow-hidden rounded-2xl border border-black/5 bg-[#131f33] transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-b from-[#0d1526] to-[#17253d]">
                    {cat.image ? (
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="180px"
                      />
                    ) : null}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-8">
                      <p className="font-heading text-sm font-semibold text-white">
                        {cat.name}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </div>
      </header>

      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
      <DealerDialog open={dealerOpen} onOpenChange={setDealerOpen} />
    </>
  );
}
