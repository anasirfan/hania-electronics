const items = [
  "FREE DELIVERY",
  "WHOLESALE",
  "PREMIUM QUALITY",
  "RECHARGEABLE",
  "OFFICIAL WARRANTY",
];

export function TrustMarquee() {
  const loop = [...items, ...items, ...items, ...items];

  return (
    <section
      aria-label="Trust highlights"
      className="relative overflow-hidden border-y border-border/70 bg-dark py-4 text-white"
    >
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap will-change-transform">
        {loop.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="font-heading text-sm font-semibold tracking-[0.28em] text-white/85"
          >
            {item}
            <span className="ml-10 text-primary-glow">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}
