import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { CinematicImage } from "@/components/media/cinematic-image";
import { categories } from "@/data/catalog/categories";

export function CategoriesSection() {
  return (
    <section id="categories" className="relative py-20 md:py-28">
      <Container className="mb-10">
        <div className="max-w-xl">
          <Reveal variant="fade">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Categories
            </p>
          </Reveal>
          <Reveal variant="mask">
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
              Find the right light
            </h2>
          </Reveal>
        </div>
      </Container>

      <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:px-6 lg:px-10">
        {categories.map((cat, i) => (
          <Reveal
            key={cat.id}
            variant="scale"
            delay={i * 0.05}
            className="w-[240px] shrink-0 snap-start sm:w-[280px]"
          >
            <Link
              href="#bestsellers"
              className="group relative block aspect-[3/4] w-full overflow-hidden rounded-[20px] bg-[#131f33]"
            >
              {cat.image ? (
                <CinematicImage
                  src={cat.image}
                  alt={cat.name}
                  fill
                  grade="cool"
                  vignette={false}
                  containerClassName="absolute inset-0"
                  className="transition-transform duration-[1200ms] ease-out group-hover:scale-[1.08]"
                  sizes="280px"
                />
              ) : (
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[radial-gradient(ellipse_120%_100%_at_30%_120%,rgba(245,197,122,0.35),transparent_60%),linear-gradient(160deg,#131f33_0%,#17253d_60%,#131f33_100%)] transition-transform duration-[1200ms] ease-out group-hover:scale-[1.08]"
                />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="font-heading text-lg font-semibold tracking-tight text-white">
                  {cat.name}
                </p>
                <p className="mt-1 text-[13px] text-white/60">
                  {cat.description}
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
