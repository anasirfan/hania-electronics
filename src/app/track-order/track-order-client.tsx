"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Container } from "@/components/layout/container";
import { formatPKR } from "@/lib/money";
import type { Order, OrderStatus } from "@/domain/types";
import { cn } from "@/lib/utils";

const STEPS: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

export default function TrackOrderClient() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = React.useState(
    searchParams.get("orderNumber") ?? "",
  );
  const [phone, setPhone] = React.useState(searchParams.get("phone") ?? "");
  const [order, setOrder] = React.useState<Order | null>(null);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const lookup = React.useCallback(async (on: string, ph: string) => {
    setLoading(true);
    setError("");
    setOrder(null);
    const res = await fetch(
      `/api/orders/track?orderNumber=${encodeURIComponent(on)}&phone=${encodeURIComponent(ph)}`,
    );
    setLoading(false);
    if (!res.ok) {
      setError("Order not found. Check your order number and phone.");
      return;
    }
    const data = await res.json();
    setOrder(data.order);
  }, []);

  React.useEffect(() => {
    const on = searchParams.get("orderNumber");
    const ph = searchParams.get("phone");
    if (on && ph) void lookup(on, ph);
  }, [searchParams, lookup]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await lookup(orderNumber, phone);
  }

  const stepIndex =
    order?.status === "cancelled"
      ? -1
      : STEPS.indexOf(order?.status ?? "pending");

  return (
    <div className="bg-[#FAFBFD] py-10 md:py-14">
      <Container className="max-w-2xl">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Track order
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your order number and the phone used at checkout.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-8 space-y-4 rounded-2xl border border-border bg-white p-5"
        >
          <div className="space-y-2">
            <Label>Order number</Label>
            <Input
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. HE-10001"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="03XXXXXXXXX"
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Searching…" : "Track order"}
          </Button>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </form>

        {order ? (
          <div className="mt-8 space-y-6 rounded-2xl border border-border bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-heading text-xl font-semibold">
                  {order.orderNumber}
                </p>
                <p className="text-sm text-muted-foreground capitalize">
                  Status: {order.status} · {formatPKR(order.total)}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(order.createdAt).toLocaleString("en-PK")}
              </p>
            </div>

            {order.status === "cancelled" ? (
              <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
                This order was cancelled.
              </p>
            ) : (
              <ol className="space-y-3">
                {STEPS.map((step, i) => {
                  const done = i <= stepIndex;
                  const current = i === stepIndex;
                  return (
                    <li key={step} className="flex items-center gap-3 text-sm">
                      <span
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold",
                          done
                            ? "border-primary bg-primary text-white"
                            : "border-border text-muted-foreground",
                          current && "ring-2 ring-primary/30",
                        )}
                      >
                        {i + 1}
                      </span>
                      <span
                        className={cn(
                          "capitalize",
                          done ? "font-medium" : "text-muted-foreground",
                        )}
                      >
                        {step}
                      </span>
                    </li>
                  );
                })}
              </ol>
            )}

            <div className="border-t border-border pt-4 text-sm">
              <p className="font-medium">{order.customer.fullName}</p>
              <p className="text-muted-foreground">
                {order.customer.address}, {order.customer.city}
              </p>
              <ul className="mt-3 space-y-1">
                {order.items.map((item) => (
                  <li key={`${item.productId}-${item.sku}`}>
                    {item.name} × {item.quantity} — {formatPKR(item.lineTotal)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </Container>
    </div>
  );
}
