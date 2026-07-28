"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProductStoreProvider } from "@/features/products/store";
import { LenisProvider } from "@/components/motion/lenis-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60_000, refetchOnWindowFocus: false },
        },
      }),
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light">
      <QueryClientProvider client={client}>
        <ProductStoreProvider>
          <TooltipProvider delayDuration={200}>
            <LenisProvider>
              {children}
              <Toaster richColors position="top-center" />
            </LenisProvider>
          </TooltipProvider>
        </ProductStoreProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
