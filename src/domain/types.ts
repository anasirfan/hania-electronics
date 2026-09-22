export type StockStatus = "in_stock" | "out_of_stock" | "preorder";

export type ManualBadge = "SALE" | "NEW" | "HOT" | "LIMITED_STOCK";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod =
  | "cod"
  | "bank_transfer"
  | "jazzcash"
  | "easypaisa"
  | "card";

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  featured: boolean;
  sortOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  subcategory?: string;
  shortDescription: string;
  description: string;
  price: number;
  salePrice: number | null;
  compareAtPrice: number | null;
  stockQuantity: number;
  stockStatus: StockStatus;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  saleBadge: boolean;
  manualBadges: ManualBadge[];
  images: ProductImage[];
  specifications: Record<string, string>;
  features: string[];
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  desktopImage: string;
  mobileImage: string;
  active: boolean;
  sortOrder: number;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AnnouncementBar {
  id: string;
  text: string;
  link: string | null;
  linkTarget: "_self" | "_blank";
  backgroundColor: string;
  textColor: string;
  active: boolean;
  updatedAt: string;
}

export interface HomepageConfig {
  featuredCategoryIds: string[];
  featuredProductIds: string[];
  bestSellerProductIds: string[];
  newArrivalProductIds: string[];
  saleProductIds: string[];
  marketingBannerId: string | null;
  sections: {
    categories: boolean;
    bestSellers: boolean;
    sale: boolean;
    newArrivals: boolean;
    featured: boolean;
    trust: boolean;
    marketingBanner: boolean;
    newsletter: boolean;
  };
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  sku: string;
  image: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderCustomer {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

/** Effective selling price */
export function getEffectivePrice(product: Product): number {
  if (product.salePrice != null && product.salePrice > 0) {
    return product.salePrice;
  }
  return product.price;
}

export function getComparePrice(product: Product): number | null {
  if (product.compareAtPrice != null && product.compareAtPrice > 0) {
    return product.compareAtPrice;
  }
  if (
    product.salePrice != null &&
    product.salePrice > 0 &&
    product.price > product.salePrice
  ) {
    return product.price;
  }
  return null;
}

export function getDiscountPercent(product: Product): number | null {
  const effective = getEffectivePrice(product);
  const compare = getComparePrice(product);
  if (!compare || compare <= effective) return null;
  return Math.round(((compare - effective) / compare) * 100);
}

export function getPrimaryImage(product: Product): string | null {
  const primary = product.images.find((i) => i.isPrimary);
  if (primary) return primary.url;
  return product.images[0]?.url ?? null;
}
