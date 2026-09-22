"use client";

import Image from "next/image";
import { formatPKR } from "@/lib/money";
import type { Order } from "@/domain/types";

export function OrderDetailsCard({ order }: { order: Order }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Order
          </p>
          <p className="mt-1 font-heading text-xl font-semibold tracking-tight">
            {order.orderNumber}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {new Date(order.createdAt).toLocaleString("en-PK")} ·{" "}
            <span className="capitalize">{order.paymentMethod.replace("_", " ")}</span>
          </p>
        </div>
        <p className="font-heading text-lg font-semibold">
          {formatPKR(order.total)}
        </p>
      </div>

      <div className="space-y-3 border-t border-border pt-4">
        {order.items.map((item) => (
          <div
            key={`${item.productId}-${item.sku}`}
            className="flex items-center gap-3"
          >
            <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-accent">
              {item.image ? (
                <Image src={item.image} alt="" fill className="object-cover" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                Qty {item.quantity} · {item.sku}
              </p>
            </div>
            <p className="text-sm font-semibold">{formatPKR(item.lineTotal)}</p>
          </div>
        ))}
      </div>

      <div className="space-y-1 border-t border-border pt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPKR(order.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>
            {order.shipping === 0 ? "Free" : formatPKR(order.shipping)}
          </span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatPKR(order.total)}</span>
        </div>
      </div>

      <div className="rounded-xl bg-[#F4F7FB] p-4 text-sm">
        <p className="font-medium">{order.customer.fullName}</p>
        <p className="mt-1 text-muted-foreground">{order.customer.phone}</p>
        <p className="mt-2 text-muted-foreground">
          {order.customer.address}
          <br />
          {order.customer.city}
          {order.customer.province ? `, ${order.customer.province}` : ""}
          {order.customer.postalCode ? ` ${order.customer.postalCode}` : ""}
        </p>
        {order.customer.notes ? (
          <p className="mt-2 text-muted-foreground">
            Notes: {order.customer.notes}
          </p>
        ) : null}
      </div>
    </div>
  );
}
