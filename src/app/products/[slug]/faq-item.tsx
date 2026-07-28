"use client";

import React from "react";
import { Reveal } from "@/components/motion/reveal";

export function FaqItem({
  question,
  answer,
  delay = 0,
}: {
  question: string;
  answer: string;
  delay?: number;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <Reveal variant="fade" delay={delay}>
      <div className="py-5">
        <button
          className="flex w-full items-center justify-between gap-4 text-left"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          <span className="font-heading text-[15px] font-medium text-foreground">
            {question}
          </span>
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground text-sm transition">
            {open ? "−" : "+"}
          </span>
        </button>
        {open && (
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            {answer}
          </p>
        )}
      </div>
    </Reveal>
  );
}
