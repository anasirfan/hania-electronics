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
      `/order/confirmed?orderNumber=${encodeURIComponent(data.order.orderNumber)}&phone=${encodeURIComponent(form.phone)}`,
    );
  }

  if (!items.length) {
    return (
      <div className="bg-[#FAFBFD] py-16">
        <Container className="max-w-md text-center">
          <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
            <h1 className="font-heading text-2xl font-semibold">Checkout</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your cart is empty. Add lights from the shop first.
            </p>
            <Button asChild className="mt-5 w-full">
              <Link href="/shop">Browse shop</Link>
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFBFD] pb-28 pt-8 sm:py-12 md:py-14">
      <Container>
        <div className="mb-6 max-w-xl sm:mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Guest checkout
          </p>
          <h1 className="mt-1 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Checkout
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cash on delivery · No account required
          </p>
        </div>
        <form
          onSubmit={onSubmit}
          className="grid gap-6 lg:grid-cols-[1fr_340px] lg:gap-8"
        >
          <div className="space-y-6 rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-6">
            <h2 className="font-heading text-lg font-semibold">
              Shipping details
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Full name *</Label>
                <Input
                  className="h-11"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                  autoComplete="name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Phone *</Label>
                <Input
                  className="h-11"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="03XXXXXXXXX"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  className="h-11"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Address *</Label>
                <Input
                  className="h-11"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  autoComplete="street-address"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>City *</Label>
                <Input
                  className="h-11"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  autoComplete="address-level2"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Province</Label>
                <Input
                  className="h-11"
                  value={form.province}
                  onChange={(e) =>
                    setForm({ ...form, province: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Postal code</Label>
                <Input
                  className="h-11"
                  value={form.postalCode}
                  onChange={(e) =>
                    setForm({ ...form, postalCode: e.target.value })
                  }
                  autoComplete="postal-code"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Order notes</Label>
                <Input
                  className="h-11"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Landmark, timing preference…"
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
                    className={`flex items-center gap-3 rounded-xl border px-3 py-3.5 text-sm transition ${
                      paymentMethod === opt.value && opt.enabled
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    } ${!opt.enabled ? "opacity-45" : "cursor-pointer"}`}
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

          <aside className="h-fit rounded-2xl border border-border bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <h2 className="font-heading text-lg font-semibold">Order summary</h2>
            <div className="mt-4 max-h-56 space-y-3 overflow-y-auto text-sm">
              {lines.map(({ item, product }) => (
                <div key={item.productId} className="flex justify-between gap-3">
                  <span className="text-muted-foreground">
                    {product.name} × {item.quantity}
                  </span>
                  <span className="shrink-0 font-medium">
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
              {shipping === 0 && subtotal > 0 ? (
                <p className="text-xs text-emerald-600">
                  Free shipping unlocked
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Free shipping on orders Rs. 5,000+
                </p>
              )}
              <div className="flex justify-between pt-1 text-base font-semibold">
                <span>Total</span>
                <span>{formatPKR(total)}</span>
              </div>
            </div>
            <Button
              type="submit"
              className="mt-5 hidden w-full lg:inline-flex"
              disabled={submitting}
            >
              {submitting ? "Placing order…" : "Place COD order"}
            </Button>
          </aside>

          {/* Mobile sticky CTA */}
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 p-3 backdrop-blur lg:hidden">
            <div className="mx-auto flex max-w-lg items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-muted-foreground">Total</p>
                <p className="font-heading text-lg font-semibold">
                  {formatPKR(total)}
                </p>
              </div>
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting ? "Placing…" : "Place COD order"}
              </Button>
            </div>
          </div>
        </form>
      </Container>
    </div>
  );
}
