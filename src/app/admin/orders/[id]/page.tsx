"use client";

import * as React from "react";
import { use } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatPKR } from "@/lib/money";
import type { Order, OrderStatus } from "@/domain/types";

const statuses: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = React.useState<Order | null>(null);

  React.useEffect(() => {
    void fetch(`/api/admin/orders/${id}`)
      .then((r) => r.json())
      .then((d) => setOrder(d.order));
  }, [id]);

  async function updateStatus(status: OrderStatus) {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      toast.error("Update failed");
      return;
    }
    const data = await res.json();
    setOrder(data.order);
    toast.success("Status updated");
  }

  if (!order) {
    return <p className="text-sm text-muted-foreground">Loading order…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold">
            {order.orderNumber}
          </h1>
          <p className="text-sm text-muted-foreground">
            {new Date(order.createdAt).toLocaleString("en-PK")} ·{" "}
            {order.paymentMethod.toUpperCase()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="h-10 rounded-md border border-input bg-white px-3 text-sm capitalize"
            value={order.status}
            onChange={(e) => void updateStatus(e.target.value as OrderStatus)}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <Button variant="outline" onClick={() => window.print()}>
            Print invoice
          </Button>
        </div>
      </div>

      <div className="grid gap-6 print:block lg:grid-cols-3">
        <section className="rounded-2xl border border-border bg-white p-5 lg:col-span-2">
          <h2 className="mb-4 font-heading text-lg font-semibold">Items</h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={`${item.productId}-${item.sku}`}
                className="flex items-center gap-3 border-b border-border/60 pb-3"
              >
                <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-accent">
                  {item.image ? (
                    <Image src={item.image} alt="" fill className="object-cover" />
                  ) : null}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.sku} · Qty {item.quantity}
                  </p>
                </div>
                <p className="font-semibold">{formatPKR(item.lineTotal)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPKR(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatPKR(order.shipping)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatPKR(order.total)}</span>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-5">
          <h2 className="mb-4 font-heading text-lg font-semibold">Customer</h2>
          <div className="space-y-2 text-sm">
            <p className="font-medium">{order.customer.fullName}</p>
            <p>{order.customer.phone}</p>
            {order.customer.email ? <p>{order.customer.email}</p> : null}
            <p className="text-muted-foreground">
              {order.customer.address}
              <br />
              {order.customer.city}, {order.customer.province}{" "}
              {order.customer.postalCode}
            </p>
            {order.customer.notes ? (
              <p className="pt-2 text-muted-foreground">
                Notes: {order.customer.notes}
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
