"use client";

import * as React from "react";
import Image from "next/image";
import { gsap } from "gsap";

const SEEN_KEY = "hania-splash-seen";

export function SplashScreen() {
  const [mounted, setMounted] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const logoRef = React.useRef<HTMLSpanElement>(null);
  const labelRef = React.useRef<HTMLSpanElement>(null);
  const tlRef = React.useRef<gsap.core.Timeline | null>(null);

  React.useEffect(() => {
    setMounted(true);

    let seen = true;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seen = false;
    }

    // Always remove the CSS blocking overlay — component is now in control
    delete (document.documentElement.dataset as Record<string, string>).splash;

    if (seen) return;

    setVisible(true);
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}

    // Run after the first paint so refs are populated
    requestAnimationFrame(() => {
      const tl = gsap.timeline();
      tlRef.current = tl;

      // ── Entrance ──────────────────────────────────────────────
      tl.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.7, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.65, ease: "back.out(1.35)" },
      ).fromTo(
        labelRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        "-=0.3",
      );

      // ── Hold, then exit ───────────────────────────────────────
      tl.to({}, { duration: 0.85 }).add(() => {
        const headerLogo = document.querySelector(
          "[data-header-logo]",
        ) as HTMLElement | null;
        const splashLogo = logoRef.current;
        if (!splashLogo) return;

        // If header logo found → fly to it; else just scale-out
        if (headerLogo) {
          const hRect = headerLogo.getBoundingClientRect();
          const sRect = splashLogo.getBoundingClientRect();

          const dx =
            hRect.left + hRect.width / 2 - (sRect.left + sRect.width / 2);
          const dy =
            hRect.top + hRect.height / 2 - (sRect.top + sRect.height / 2);
          const scale = hRect.width / sRect.width;

          gsap.to(splashLogo, {
            x: dx,
            y: dy,
            scale,
            duration: 0.72,
            ease: "expo.inOut",
          });
        } else {
          gsap.to(splashLogo, {
            scale: 0.6,
            opacity: 0,
            duration: 0.45,
            ease: "power3.in",
          });
        }

        // Label fades up-out immediately
        gsap.to(labelRef.current, {
          opacity: 0,
          y: -8,
          duration: 0.22,
          ease: "power2.in",
        });

        // Overlay fades out after logo is mid-flight
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.48,
          delay: 0.32,
          ease: "power2.in",
          onComplete: () => setVisible(false),
        });
      });
    });

    return () => {
      tlRef.current?.kill();
    };
  }, []);

  if (!mounted || !visible) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{ backgroundColor: "#f6f3ed" }}
    >
      {/* Warm ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 52% 44% at 50% 50%, rgba(245,197,122,0.24), transparent 64%)",
        }}
      />

      {/* Logo mark */}
      <span
        ref={logoRef}
        className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-white"
        style={{
          opacity: 0,
          boxShadow:
            "0 24px 64px -12px rgba(0,0,0,0.13), 0 0 0 1px rgba(0,0,0,0.05)",
        }}
      >
        <Image
          src="/brand/logo-mark-transparent.webp"
          alt="Hania Electronics"
          fill
          className="object-contain p-4"
          priority
        />
      </span>

      {/* Brand name */}
      <span
        ref={labelRef}
        className="mt-5 text-[11px] font-medium uppercase tracking-[0.34em]"
        style={{ opacity: 0, color: "rgba(17,15,11,0.42)" }}
      >
        Hania Electronics
      </span>
    </div>
  );
}
