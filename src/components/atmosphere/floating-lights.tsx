"use client";

import { cn } from "@/lib/utils";

const lights = [
  { className: "left-[8%] top-[20%] h-56 w-56 bg-primary-glow/30", delay: "0s" },
  { className: "right-[12%] top-[35%] h-72 w-72 bg-primary/25", delay: "2s" },
  { className: "left-[40%] top-[70%] h-64 w-64 bg-warm-glow/20", delay: "4s" },
  { className: "right-[30%] bottom-[10%] h-48 w-48 bg-primary-glow/20", delay: "1s" },
  { className: "left-[65%] top-[10%] h-40 w-40 bg-secondary/20", delay: "3s" },
];

export function FloatingLights({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 z-[1] overflow-hidden",
        className,
      )}
    >
      {lights.map((light, i) => (
        <div
          key={i}
          className={cn(
            "absolute rounded-full blur-3xl mix-blend-screen animate-drift",
            light.className,
          )}
          style={{ animationDelay: light.delay }}
        />
      ))}
    </div>
  );
}
