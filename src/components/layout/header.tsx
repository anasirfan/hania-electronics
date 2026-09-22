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
  ShoppingCart,
  Heart,
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
import { BRAND, telUrl, whatsappUrl } from "@/lib/brand";
import { mediaUrl } from "@/lib/media-url";
import { cn } from "@/lib/utils";
import type { Category } from "@/domain/types";
import { useCart } from "@/features/cart/store";
import { useWishlist } from "@/features/wishlist/store";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/become-a-dealer", label: "Become a Dealer" },
  { href: "/contact", label: "Contact" },
];

export function Header({ categories = [] }: { categories?: Category[] }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [dealerOpen, setDealerOpen] = React.useState(false);
  const [megaOpen, setMegaOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const { count, setOpen: setCartOpen } = useCart();
  const wishlist = useWishlist();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
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
          "sticky top-0 z-50 border-b transition-all duration-300",
          scrolled || megaOpen
            ? "border-border bg-white/95 text-foreground shadow-sm backdrop-blur-xl"
            : "border-transparent bg-white text-foreground",
        )}
      >
        <Container className="relative">
          <div className="flex h-14 items-center justify-between gap-3 sm:h-[68px] sm:gap-4">
            <Link href="/" className="flex items-center gap-3">
              <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B1220] p-2">
                <Image
                  src={mediaUrl("/brand/logo-mark-transparent.webp")}
                  alt="Hania Electronics"
                  fill
                  className="object-contain p-1.5"
                  priority
                />
              </span>
              <span className="font-heading text-[15px] font-semibold tracking-[-0.02em] sm:text-base">
                HANIA
                <span className="ml-1.5 font-normal text-muted-foreground">
                  Electronics
                </span>
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
                    "inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-[14px] font-medium text-foreground/75 transition hover:bg-black/6 hover:text-foreground",
                    megaOpen && "bg-black/6 text-foreground",
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
                  className="rounded-full px-3.5 py-2 text-[14px] font-medium text-foreground/75 transition hover:bg-black/6 hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1 sm:gap-1.5">
              <button
                onClick={() => setSearchOpen(true)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 hover:bg-black/6"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>

              <Link
                href="/track-order"
                className="hidden h-10 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium text-foreground/75 transition hover:bg-black/6 xl:inline-flex"
              >
                <PackageSearch className="h-4 w-4" />
                Track
              </Link>

              <Link
                href="/wishlist"
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/6"
                aria-label="Wishlist"
              >
                <Heart className="h-4 w-4" />
                {wishlist.ids.length > 0 ? (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">
                    {wishlist.ids.length}
                  </span>
                ) : null}
              </Link>

              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/6"
                aria-label="Cart"
              >
                <ShoppingCart className="h-4 w-4" />
                {count > 0 ? (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">
                    {count}
                  </span>
                ) : null}
              </button>

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
                className="hidden h-10 rounded-full md:inline-flex"
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
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/8 text-foreground lg:hidden"
                    aria-label="Menu"
                  >
                    <Menu className="h-4 w-4" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full max-w-sm">
                  <SheetHeader>
                    <SheetTitle className="font-heading">
                      HANIA Electronics
                    </SheetTitle>
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
                            href={`/shop/${cat.slug}`}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2 rounded-xl border border-border p-2"
                          >
                            <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-[#131f33]">
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
                      <Link
                        href="/track-order"
                        onClick={() => setMobileOpen(false)}
                        className="rounded-xl px-3 py-3 text-sm font-medium hover:bg-accent"
                      >
                        Track order
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setMobileOpen(false);
                          setDealerOpen(true);
                        }}
                        className="rounded-xl px-3 py-3 text-left text-sm font-medium hover:bg-accent"
                      >
                        Become a Dealer
                      </button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </Container>

        <div
          className={cn(
            "absolute inset-x-0 top-full origin-top border-b border-border bg-white text-foreground shadow-xl transition-all duration-200",
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
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Shop by category
                </p>
                <p className="mt-1 font-heading text-2xl font-semibold tracking-tight">
                  Find the right light
                </p>
              </div>
              <button
                className="rounded-full p-2 text-muted-foreground hover:bg-accent lg:hidden"
                onClick={() => setMegaOpen(false)}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop/${cat.slug}`}
                  onClick={() => setMegaOpen(false)}
                  className="group overflow-hidden rounded-2xl border border-border bg-[#F8FAFC] transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#0d1526]">
                    {cat.image ? (
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="280px"
                      />
                    ) : null}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-10">
                      <p className="font-heading text-base font-semibold text-white">
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
