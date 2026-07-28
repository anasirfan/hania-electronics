"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

type RevealVariant =
  | "fade"
  | "slide"
  | "scale"
  | "blur"
  | "mask"
  | "clip";

const variants: Record<
  RevealVariant,
  {
    hidden: HTMLMotionProps<"div">["initial"];
    visible: HTMLMotionProps<"div">["animate"];
  }
> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slide: {
    hidden: { opacity: 0, y: 36 },
    visible: { opacity: 1, y: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1 },
  },
  blur: {
    hidden: { opacity: 0, filter: "blur(12px)", y: 20 },
    visible: { opacity: 1, filter: "blur(0px)", y: 0 },
  },
  mask: {
    hidden: { opacity: 0, clipPath: "inset(0 0 100% 0)" },
    visible: { opacity: 1, clipPath: "inset(0 0 0% 0)" },
  },
  clip: {
    hidden: { opacity: 0, clipPath: "inset(8% 12% 8% 12% round 24px)" },
    visible: { opacity: 1, clipPath: "inset(0% 0% 0% 0% round 0px)" },
  },
};

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  once?: boolean;
};

export function Reveal({
  children,
  className,
  variant = "slide",
  delay = 0,
  duration = 0.7,
  once = true,
}: RevealProps) {
  const v = variants[variant];

  return (
    <motion.div
      className={cn(className?.includes("h-full") && "[&>*]:h-full", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      variants={{
        hidden: v.hidden as never,
        visible: v.visible as never,
      }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
