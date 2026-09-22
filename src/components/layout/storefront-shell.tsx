"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AnnouncementBar } from "@/features/cms/announcement-bar";
import { CartDrawer } from "@/features/cart/cart-drawer";
import { defaultSiteSettings } from "@/lib/site-settings";
import type {
  AnnouncementBar as AnnouncementType,
  Category,
  Product,
  SiteSettings,
} from "@/domain/types";

type CatalogPayload = {
  categories: Category[];
  products: Product[];
  announcement: AnnouncementType | null;
  settings: SiteSettings;
};

const CatalogContext = React.createContext<CatalogPayload>({
  categories: [],
  products: [],
  announcement: null,
  settings: defaultSiteSettings(),
});

export function useStorefrontCatalog() {
  return React.useContext(CatalogContext);
}

export function useSiteSettings() {
  return React.useContext(CatalogContext).settings;
}

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const [catalog, setCatalog] = React.useState<CatalogPayload>({
    categories: [],
    products: [],
    announcement: null,
    settings: defaultSiteSettings(),
  });

  React.useEffect(() => {
    if (isAdmin) return;
    void fetch("/api/catalog")
      .then((r) => r.json())
      .then((d) =>
        setCatalog({
          categories: d.categories ?? [],
          products: d.products ?? [],
          announcement: d.announcement ?? null,
          settings: d.settings ?? defaultSiteSettings(),
        }),
      );
  }, [isAdmin]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <CatalogContext.Provider value={catalog}>
      <AnnouncementBar announcement={catalog.announcement} />
      <Header categories={catalog.categories} />
      <main className="relative z-[3] min-h-[60vh] bg-[#FAFBFD]">
        {children}
      </main>
      <Footer />
      <CartDrawer products={catalog.products} />
    </CatalogContext.Provider>
  );
}
