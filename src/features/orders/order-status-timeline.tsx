"use client";

import { Check } from "lucide-react";
import type { OrderStatus } from "@/domain/types";
import { cn } from "@/lib/utils";

export const ORDER_STEPS: {
  key: OrderStatus;
  label: string;
  hint: string;
}[] = [
  { key: "pending", label: "Placed", hint: "We received your order" },
  { key: "confirmed", label: "Confirmed", hint: "Team verified your COD order" },
  { key: "processing", label: "Packing", hint: "Items being prepared" },
  { key: "shipped", label: "Shipped", hint: "On the way to you" },
  { key: "delivered", label: "Delivered", hint: "Order completed" },
];

export function OrderStatusTimeline({
  status,
  compact = false,
}: {
  status: OrderStatus;
  compact?: boolean;
}) {
  if (status === "cancelled") {
    return (
      <p className="rounded-xl bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
        This order was cancelled. Contact us on WhatsApp if you need help.
      </p>
    );
  }

  const stepIndex = ORDER_STEPS.findIndex((s) => s.key === status);

  return (
    <ol className={cn("relative", compact ? "space-y-3" : "space-y-0")}>
      {ORDER_STEPS.map((step, i) => {
        const done = i <= stepIndex;
        const current = i === stepIndex;
        const isLast = i === ORDER_STEPS.length - 1;
        return (
          <li key={step.key} className="relative flex gap-3 pb-5 last:pb-0">
            {!isLast ? (
              <span
                aria-hidden
                className={cn(
                  "absolute left-[15px] top-8 h-[calc(100%-20px)] w-0.5",
                  i < stepIndex ? "bg-primary" : "bg-border",
                )}
              />
            ) : null}
            <span
              className={cn(
                "relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                done
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-white text-muted-foreground",
                current && "ring-4 ring-primary/15",
              )}
            >
              {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
            </span>
            <div className="min-w-0 pt-0.5">
              <p
                className={cn(
                  "text-sm font-medium",
                  done ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step.label}
                {current ? (
                  <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                    Current
                  </span>
                ) : null}
              </p>
              {!compact ? (
                <p className="mt-0.5 text-xs text-muted-foreground">{step.hint}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
