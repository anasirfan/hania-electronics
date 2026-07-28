import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

type Grade = "cool" | "warm" | "neutral";

export function CinematicImage({
  containerClassName,
  className,
  grade = "cool",
  vignette = true,
  kenBurns = false,
  alt,
  ...props
}: Omit<ImageProps, "className"> & {
  containerClassName?: string;
  className?: string;
  grade?: Grade;
  vignette?: boolean;
  kenBurns?: boolean;
}) {
  return (
    // containerClassName must supply positioning (e.g. "absolute inset-0") —
    // it is not forced here to avoid colliding with a hardcoded "relative".
    <div className={cn("overflow-hidden", containerClassName)}>
      <Image
        alt={alt}
        {...props}
        className={cn(
          "cinematic-grade object-cover",
          kenBurns && "animate-ken-burns",
          className,
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0",
          grade === "cool" && "cinematic-overlay-cool",
          grade === "warm" && "cinematic-overlay-warm",
          grade === "neutral" && "cinematic-overlay-neutral",
        )}
      />
      {vignette ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 cinematic-vignette" />
      ) : null}
    </div>
  );
}
