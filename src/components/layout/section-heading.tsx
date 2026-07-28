import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-12 max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <Reveal variant="fade">
          <p
            className={cn(
              "mb-3 text-xs font-semibold uppercase tracking-[0.22em]",
              light ? "text-primary-glow" : "text-primary",
            )}
          >
            {eyebrow}
          </p>
        </Reveal>
      ) : null}
      <Reveal variant="mask">
        <h2
          className={cn(
            "font-heading text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl",
            light ? "text-white" : "text-foreground",
          )}
        >
          {title}
        </h2>
      </Reveal>
      {description ? (
        <Reveal variant="blur" delay={0.1}>
          <p
            className={cn(
              "mt-4 text-base leading-relaxed sm:text-lg",
              light ? "text-white/70" : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
