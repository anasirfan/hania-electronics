"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Pill-style toggle button used across the admin dashboard instead of raw
 * checkboxes (product flags, homepage sections, etc.).
 */
export function ToggleSwitch({
  checked,
  onChange,
  label,
  hint,
  className,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  hint?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "group flex w-full items-center justify-between gap-4 rounded-xl border px-4 py-3 text-left transition",
        checked
          ? "border-primary/40 bg-primary/5"
          : "border-border bg-white hover:border-foreground/20",
        className,
      )}
    >
      <span className="min-w-0">
        <span
          className={cn(
            "block text-sm font-medium",
            checked ? "text-foreground" : "text-foreground/80",
          )}
        >
          {label}
        </span>
        {hint && (
          <span className="mt-0.5 block text-xs text-muted-foreground">
            {hint}
          </span>
        )}
      </span>
      <span
        aria-hidden
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
          checked ? "bg-primary" : "bg-foreground/15",
        )}
      >
        <span
          className={cn(
            "absolute left-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-5" : "translate-x-0",
          )}
        >
          {checked && <Check className="h-3 w-3 text-primary" strokeWidth={3} />}
        </span>
      </span>
    </button>
  );
}

/** Compact pill variant (chip-like) for inline rows. */
export function TogglePill({
  checked,
  onChange,
  label,
  className,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
        checked
          ? "border-primary bg-primary text-white"
          : "border-border bg-white text-foreground/70 hover:border-foreground/30",
        className,
      )}
    >
      {checked && <Check className="h-3 w-3" strokeWidth={3} />}
      {label}
    </button>
  );
}
