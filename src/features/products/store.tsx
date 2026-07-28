"use client";

import * as React from "react";
import { toast } from "sonner";

type ProductStore = {
  wishlist: string[];
  compare: string[];
  toggleWishlist: (id: string) => void;
  toggleCompare: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  isCompared: (id: string) => boolean;
};

const ProductStoreContext = React.createContext<ProductStore | null>(null);

const WISHLIST_KEY = "hania-wishlist";
const COMPARE_KEY = "hania-compare";

function readList(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function ProductStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [wishlist, setWishlist] = React.useState<string[]>([]);
  const [compare, setCompare] = React.useState<string[]>([]);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setWishlist(readList(WISHLIST_KEY));
    setCompare(readList(COMPARE_KEY));
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  React.useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(COMPARE_KEY, JSON.stringify(compare));
  }, [compare, hydrated]);

  const toggleWishlist = React.useCallback((id: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(id);
      toast.success(exists ? "Removed from wishlist" : "Added to wishlist");
      return exists ? prev.filter((x) => x !== id) : [...prev, id];
    });
  }, []);

  const toggleCompare = React.useCallback((id: string) => {
    setCompare((prev) => {
      const exists = prev.includes(id);
      if (!exists && prev.length >= 3) {
        toast.error("Compare up to 3 products");
        return prev;
      }
      toast.success(exists ? "Removed from compare" : "Added to compare");
      return exists ? prev.filter((x) => x !== id) : [...prev, id];
    });
  }, []);

  const value = React.useMemo(
    () => ({
      wishlist,
      compare,
      toggleWishlist,
      toggleCompare,
      isWishlisted: (id: string) => wishlist.includes(id),
      isCompared: (id: string) => compare.includes(id),
    }),
    [wishlist, compare, toggleWishlist, toggleCompare],
  );

  return (
    <ProductStoreContext.Provider value={value}>
      {children}
    </ProductStoreContext.Provider>
  );
}

export function useProductStore() {
  const ctx = React.useContext(ProductStoreContext);
  if (!ctx) {
    throw new Error("useProductStore must be used within ProductStoreProvider");
  }
  return ctx;
}
