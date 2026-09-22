import { Suspense } from "react";
import TrackOrderPage from "./track-order-client";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#FAFBFD] py-16 text-center text-sm text-muted-foreground">
          Loading…
        </div>
      }
    >
      <TrackOrderPage />
    </Suspense>
  );
}
