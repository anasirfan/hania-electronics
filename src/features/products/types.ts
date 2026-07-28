export type Purpose =
  | "home"
  | "office"
  | "camping"
  | "emergency"
  | "construction"
  | "travel"
  | "industrial";

export type ProductBadge = "sale" | "new" | "bestseller";

export type CategoryId =
  | "torch"
  | "solar"
  | "emergency"
  | "head-lamps"
  | "bulbs"
  | "outdoor"
  | "accessories";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  pricePkr: number;
  compareAtPkr?: number;
  image: string | null;
  category: CategoryId;
  purposes: Purpose[];
  badge?: ProductBadge;
  inStock: boolean;
  features: string[];
  featured?: boolean;
  bestseller?: boolean;
}

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  image: string | null;
}

export interface PurposeOption {
  id: Purpose;
  name: string;
  description: string;
}
