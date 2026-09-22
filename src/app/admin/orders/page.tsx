"use client";

import * as React from "react";
import Link from "next/link";
import { formatPKR } from "@/lib/money";
import type { Order } from "@/domain/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [q, setQ] = React.useState("");

  React.useEffect(() => {
    void fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? []));
  }, []);

  const filtered = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(q.toLowerCase()) ||
      o.customer.fullName.toLowerCase().includes(q.toLowerCase()) ||
      o.customer.phone.includes(q),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Orders</h1>
        <p className="text-sm text-muted-foreground">
          Manage COD orders and fulfillment status.
        </p>
      </div>

      <input
        className="flex h-10 max-w-sm rounded-md border border-input bg-white px-3 text-sm"
        placeholder="Search order #, name, phone…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <div className="overflow-hidden rounded-2xl border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-[#F8FAFC] text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-b border-border/70">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {o.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <p>{o.customer.fullName}</p>
                  <p className="text-xs text-muted-foreground">
                    {o.customer.phone}
                  </p>
                </td>
                <td className="px-4 py-3">{formatPKR(o.total)}</td>
                <td className="px-4 py-3 capitalize">{o.status}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(o.createdAt).toLocaleDateString("en-PK")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
