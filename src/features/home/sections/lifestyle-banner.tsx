import { CinematicImage } from "@/components/media/cinematic-image";
import { Reveal } from "@/components/motion/reveal";
import { media } from "@/data/catalog/media";

const STRIP: { src: string; alt: string; grade: "warm" | "cool" }[] = [
  { src: media.scenes.gardenLantern, alt: "Vintage garden lantern at dusk", grade: "warm" },
  { src: media.scenes.deskLamp, alt: "Home desk lit by a warm lamp", grade: "warm" },
  { src: media.hero, alt: "Bedroom at golden hour", grade: "warm" },
  { src: media.scenes.headlampLifestyle, alt: "Headlamp in the dark", grade: "cool" },
  { src: media.scenes.camping!, alt: "Camping at night", grade: "cool" },
];

const doubled = [...STRIP, ...STRIP];

export function LifestyleBannerSection() {
  return (
    <section className="relative overflow-hidden py-14 md:py-20">
      <Reveal variant="fade">
        <p className="mb-10 px-5 font-heading text-[clamp(1.6rem,4vw,2.75rem)] font-medium leading-snug tracking-tight text-foreground sm:px-8 lg:px-12">
          Light that belongs
          <br />
          in the room.
        </p>
      </Reveal>

      {/* Scrolling image strip — pauses on hover */}
      <div className="group flex gap-4 overflow-hidden">
        <div className="flex animate-marquee gap-4 group-hover:[animation-play-state:paused]">
          {doubled.map((img, i) => (
            <div
              key={i}
              className="relative h-[220px] w-[340px] shrink-0 overflow-hidden rounded-[18px] sm:h-[260px] sm:w-[400px]"
            >
              <CinematicImage
                src={img.src}
                alt={img.alt}
                fill
                grade={img.grade}
                vignette={false}
                containerClassName="absolute inset-0"
                sizes="400px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
