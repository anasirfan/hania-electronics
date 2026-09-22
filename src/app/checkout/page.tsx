"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Container } from "@/components/layout/container";
import { formatPKR } from "@/lib/money";
import {
  getEffectivePrice,
  getPrimaryImage,
  type PaymentMethod,
  type Product,
} from "@/domain/types";
import { useCart } from "@/features/cart/store";
import { useStorefrontCatalog } from "@/components/layout/storefront-shell";

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; enabled: boolean }[] =
  [
    { value: "cod", label: "Cash on Delivery", enabled: true },
    { value: "jazzcash", label: "JazzCash (coming soon)", enabled: false },
    { value: "easypaisa", label: "EasyPaisa (coming soon)", enabled: false },
    { value: "card", label: "Card (coming soon)", enabled: false },
    { value: "bank_transfer", label: "Bank transfer (coming soon)", enabled: false },
  ];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clear } = useCart();
  const { products } = useStorefrontCatalog();
  const [submitting, setSubmitting] = React.useState(false);
  const [paymentMethod, setPaymentMethod] =
    React.useState<PaymentMethod>("cod");
  const [form, setForm] = React.useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    province: "Sindh",
    postalCode: "",
    notes: "",
  });

  const byId = React.useMemo(
    () => new Map(products.map((p) => [p.id, p])),
    [products],
  );

  const lines = items
    .map((item) => {
      const product = byId.get(item.productId);
      if (!product) return null;
      return { item, product };
    })
    .filter(Boolean) as {
    item: { productId: string; quantity: number };
    product: Product;
  }[];

  const subtotal = lines.reduce(
    (sum, l) => sum + getEffectivePrice(l.product) * l.item.quantity,
    0,
  );
  const shipping = subtotal >= 5000 || subtotal === 0 ? 0 : 250;
  const total = subtotal + shipping;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!lines.length) {
      toast.error("Your cart is empty");
      return;
    }
    if (paymentMethod !== "cod") {
      toast.error("Only Cash on Delivery is available right now");
      return;
    }
    if (!form.fullName || !form.phone || !form.address || !form.city) {
      toast.error("Please fill required fields");
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: form,
        items: lines.map(({ item, product }) => ({
          productId: product.id,
          name: product.name,
          sku: product.sku,
          image: getPrimaryImage(product),
          quantity: item.quantity,
          unitPrice: getEffectivePrice(product),
          lineTotal: getEffectivePrice(product) * item.quantity,
        })),
        subtotal,
        discount: 0,
        shipping,
        total,
        paymentMethod,
        status: "pending",
      }),
    });
    setSubmitting(false);

    if (!res.ok) {
      toast.error("Could not place order");
      return;
    }

    const data = await res.json();
    clear();
    toast.success(`Order ${data.order.orderNumber} placed`);
    router.push(
      `/track-order?orderNumber=${encodeURIComponent(data.order.orderNumber)}&phone=${encodeURIComponent(form.phone)}`,
    );
  }

  if (!items.length) {
    return (
      <div className="bg-[#FAFBFD] py-16">
        <Container className="text-center">
          <h1 className="font-heading text-2xl font-semibold">Checkout</h1>
          <p className="mt-2 text-muted-foreground">Your cart is empty.</p>
          <Button asChild className="mt-4">
            <Link href="/shop">Shop products</Link>
          </Button>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFBFD] py-10 md:py-14">
      <Container>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Checkout
        </h1>
        <form
          onSubmit={onSubmit}
          className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]"
        >
          <div className="space-y-6 rounded-2xl border border-border bg-white p-5 md:p-6">
            <h2 className="font-heading text-lg font-semibold">
              Shipping details
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Full name *</Label>
                <Input
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Phone *</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Address *</Label>
                <Input
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>City *</Label>
                <Input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Province</Label>
                <Input
                  value={form.province}
                  onChange={(e) =>
                    setForm({ ...form, province: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Postal code</Label>
                <Input
                  value={form.postalCode}
                  onChange={(e) =>
                    setForm({ ...form, postalCode: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Order notes</Label>
                <Input
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
            </div>

            <div>
              <h2 className="mb-3 font-heading text-lg font-semibold">
                Payment method
              </h2>
              <div className="space-y-2">
                {PAYMENT_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 rounded-xl border px-3 py-3 text-sm ${
                      !opt.enabled ? "opacity-50" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={opt.value}
                      disabled={!opt.enabled}
                      checked={paymentMethod === opt.value}
                      onChange={() => setPaymentMethod(opt.value)}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-border bg-white p-5">
            <h2 className="font-heading text-lg font-semibold">Order summary</h2>
            <div className="mt-4 space-y-3 text-sm">
              {lines.map(({ item, product }) => (
                <div key={item.productId} className="flex justify-between gap-3">
                  <span className="text-muted-foreground">
                    {product.name} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    {formatPKR(getEffectivePrice(product) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : formatPKR(shipping)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatPKR(total)}</span>
              </div>
            </div>
            <Button type="submit" className="mt-5 w-full" disabled={submitting}>
              {submitting ? "Placing order…" : "Place COD order"}
            </Button>
          </aside>
        </form>
      </Container>
    </div>
  );
}
