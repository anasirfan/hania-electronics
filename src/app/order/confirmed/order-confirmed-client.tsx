"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Copy, MessageCircle, PackageSearch } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { OrderDetailsCard } from "@/features/orders/order-details-card";
import { OrderStatusTimeline } from "@/features/orders/order-status-timeline";
import { BRAND, whatsappUrl } from "@/lib/brand";
import type { Order } from "@/domain/types";

export default function OrderConfirmedClient() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") ?? "";
  const phone = searchParams.get("phone") ?? "";
  const [order, setOrder] = React.useState<Order | null>(null);
  const [loading, setLoading] = React.useState(Boolean(orderNumber && phone));

  React.useEffect(() => {
    if (!orderNumber || !phone) {
      setLoading(false);
      return;
    }
    void fetch(
      `/api/orders/track?orderNumber=${encodeURIComponent(orderNumber)}&phone=${encodeURIComponent(phone)}`,
    )
      .then(async (r) => {
        if (!r.ok) throw new Error("missing");
        return r.json();
      })
      .then((d) => setOrder(d.order))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [orderNumber, phone]);

  function copyOrderNumber() {
    if (!orderNumber) return;
    void navigator.clipboard.writeText(orderNumber);
    toast.success("Order number copied");
  }

  const trackHref = `/track-order?orderNumber=${encodeURIComponent(orderNumber)}&phone=${encodeURIComponent(phone)}`;
  const waMessage = order
    ? `Assalam o Alaikum! I just placed order *${order.orderNumber}* on HANIA Electronics.\nPhone: ${order.customer.phone}\nTotal: Rs. ${order.total.toLocaleString("en-PK")}`
    : `Assalam o Alaikum! I need help with my HANIA order ${orderNumber}.`;

  if (!orderNumber || !phone) {
    return (
      <div className="bg-[#FAFBFD] py-16">
        <Container className="max-w-lg text-center">
          <h1 className="font-heading text-2xl font-semibold">No order found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Place an order at checkout, or track an existing one.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/shop">Continue shopping</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/track-order">Track order</Link>
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFBFD] py-8 sm:py-12 md:py-14">
      <Container className="max-w-3xl">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-8">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-7 w-7" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                Order placed
              </p>
              <h1 className="mt-1 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                Shukriya! Your COD order is in.
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Save your order number — use it anytime with your phone to track
                delivery. No account needed.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2 rounded-xl bg-[#F4F7FB] p-3 sm:p-4">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Your order number
              </p>
              <p className="font-heading text-xl font-semibold tracking-tight">
                {orderNumber}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={copyOrderNumber}
            >
              <Copy className="h-3.5 w-3.5" />
              Copy
            </Button>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <Button asChild className="w-full">
              <Link href={trackHref}>
                <PackageSearch className="h-4 w-4" />
                Track this order
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <a href={whatsappUrl(waMessage)} target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4" />
                WhatsApp us
              </a>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/shop">Keep shopping</Link>
            </Button>
          </div>

          <ul className="mt-6 space-y-2 rounded-xl border border-border/80 p-4 text-sm text-muted-foreground">
            <li>• Cash on delivery — pay when the parcel arrives.</li>
            <li>
              • Track anytime at Track Order with {orderNumber} + your phone.
            </li>
            <li>
              • Need a change? Message {BRAND.phones.whatsapp} on WhatsApp.
            </li>
          </ul>
        </div>

        {loading ? (
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Loading order details…
          </p>
        ) : order ? (
          <div className="mt-6 grid gap-6 lg:grid-cols-5">
            <section className="rounded-2xl border border-border bg-white p-5 lg:col-span-3">
              <h2 className="mb-4 font-heading text-lg font-semibold">
                Order details
              </h2>
              <OrderDetailsCard order={order} />
            </section>
            <section className="rounded-2xl border border-border bg-white p-5 lg:col-span-2">
              <h2 className="mb-4 font-heading text-lg font-semibold">
                Status
              </h2>
              <OrderStatusTimeline status={order.status} />
            </section>
          </div>
        ) : (
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Order saved. Use Track Order if details don’t appear here.
          </p>
        )}
      </Container>
    </div>
  );
}
