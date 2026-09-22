"use client";

import * as React from "react";
import Link from "next/link";
import { formatPKR } from "@/lib/money";
import type { Order, Product } from "@/domain/types";

type Stats = {
  totalOrders: number;
  pendingOrders: number;
  revenue: number;
  productCount: number;
  categoryCount: number;
  lowStock: Product[];
  recentOrders: Order[];
};

export default function AdminDashboardPage() {
  const [stats, setStats] = React.useState<Stats | null>(null);

  React.useEffect(() => {
    void fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats);
  }, []);

  if (!stats) {
    return <p className="text-sm text-muted-foreground">Loading dashboard…</p>;
  }

  const cards = [
    { label: "Revenue", value: formatPKR(stats.revenue) },
    { label: "Orders", value: String(stats.totalOrders) },
    { label: "Pending", value: String(stats.pendingOrders) },
    { label: "Products", value: String(stats.productCount) },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Overview
        </h1>
        <p className="text-sm text-muted-foreground">
          Store performance at a glance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-border bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {c.label}
            </p>
            <p className="mt-2 font-heading text-2xl font-semibold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm text-primary">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentOrders.map((o) => (
              <Link
                key={o.id}
                href={`/admin/orders/${o.id}`}
                className="flex items-center justify-between rounded-xl border border-border/70 px-3 py-2.5 text-sm hover:bg-accent/40"
              >
                <div>
                  <p className="font-medium">{o.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    {o.customer.fullName} · {o.status}
                  </p>
                </div>
                <p className="font-semibold">{formatPKR(o.total)}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-5">
          <h2 className="mb-4 font-heading text-lg font-semibold">Low stock</h2>
          <div className="space-y-3">
            {stats.lowStock.length === 0 ? (
              <p className="text-sm text-muted-foreground">All stock healthy.</p>
            ) : (
              stats.lowStock.slice(0, 8).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{p.name}</span>
                  <span className="font-medium text-amber-600">
                    {p.stockQuantity} left
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
