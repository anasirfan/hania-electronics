import { Suspense } from "react";
import type { Metadata } from "next";
import OrderConfirmedClient from "./order-confirmed-client";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

export default function OrderConfirmedPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#FAFBFD] py-16 text-center text-sm text-muted-foreground">
          Confirming your order…
        </div>
      }
    >
      <OrderConfirmedClient />
    </Suspense>
  );
}
