import Image from "next/image";
import Link from "next/link";

export function MidBannerSection() {
  return (
    <section className="px-4 py-10 md:py-14 sm:px-6 lg:px-8">
      <Link href="/products" className="group block">
        <div className="relative w-full overflow-hidden rounded-2xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.18)] transition-transform duration-500 group-hover:scale-[1.01]">
          <Image
            src="/hero/banner-mid-section.jpg"
            alt="Brighter Nights, Better Lifestyle — Hania Electronics"
            width={1366}
            height={500}
            className="w-full object-cover"
            priority={false}
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 95vw, 1280px"
          />
        </div>
      </Link>
    </section>
  );
}
