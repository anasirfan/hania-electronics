"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MessageCircle, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Container } from "@/components/layout/container";
import { OrderDetailsCard } from "@/features/orders/order-details-card";
import { OrderStatusTimeline } from "@/features/orders/order-status-timeline";
import { whatsappUrl } from "@/lib/brand";
import type { Order } from "@/domain/types";

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
      `/api/orders/track?orderNumber=${encodeURIComponent(on.trim())}&phone=${encodeURIComponent(ph.trim())}`,
    );
    setLoading(false);
    if (!res.ok) {
      setError("Order not found. Double-check the order number and phone.");
      return;
    }
    const data = await res.json();
    setOrder(data.order);
  }, []);

  React.useEffect(() => {
    const on = searchParams.get("orderNumber");
    const ph = searchParams.get("phone");
    if (on && ph) {
      setOrderNumber(on);
      setPhone(ph);
      void lookup(on, ph);
    }
  }, [searchParams, lookup]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await lookup(orderNumber, phone);
  }

  return (
    <div className="bg-[#FAFBFD] py-8 sm:py-12 md:py-14">
      <Container className="max-w-3xl">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Guest tracking
          </p>
          <h1 className="mt-1 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Track your order
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            No login needed. Enter the order number from your confirmation and
            the phone you used at checkout.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="mt-6 space-y-4 rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="orderNumber">Order number</Label>
              <Input
                id="orderNumber"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. HE-10001"
                className="h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="03XXXXXXXXX"
                className="h-11"
                inputMode="tel"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
            <PackageSearch className="h-4 w-4" />
            {loading ? "Searching…" : "Track order"}
          </Button>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </form>

        {order ? (
          <div className="mt-6 grid gap-6 lg:grid-cols-5">
            <section className="rounded-2xl border border-border bg-white p-5 shadow-sm lg:col-span-2">
              <h2 className="mb-4 font-heading text-lg font-semibold">
                Delivery status
              </h2>
              <OrderStatusTimeline status={order.status} />
              <Button asChild variant="outline" className="mt-6 w-full">
                <a
                  href={whatsappUrl(
                    `Assalam o Alaikum! I need help with order *${order.orderNumber}* (phone ${order.customer.phone}).`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="h-4 w-4" />
                  Ask on WhatsApp
                </a>
              </Button>
            </section>
            <section className="rounded-2xl border border-border bg-white p-5 shadow-sm lg:col-span-3">
              <h2 className="mb-4 font-heading text-lg font-semibold">
                Order details
              </h2>
              <OrderDetailsCard order={order} />
            </section>
          </div>
        ) : !loading && !error ? (
          <div className="mt-8 rounded-2xl border border-dashed border-border bg-white/60 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Demo tip: try order <strong>HE-10001</strong> with phone{" "}
              <strong>03331234567</strong>
            </p>
            <Button asChild variant="link" className="mt-2">
              <Link href="/shop">Browse products</Link>
            </Button>
          </div>
        ) : null}
      </Container>
    </div>
  );
}
