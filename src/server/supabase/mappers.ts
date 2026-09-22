import type {
  AnnouncementBar,
  Banner,
  Category,
  HomepageConfig,
  Order,
  Product,
  ProductImage,
} from "@/domain/types";

type DbCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  featured: boolean;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

type DbProduct = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category_id: string;
  subcategory: string | null;
  short_description: string;
  description: string;
  price: number;
  sale_price: number | null;
  compare_at_price: number | null;
  stock_quantity: number;
  stock_status: Product["stockStatus"];
  featured: boolean;
  best_seller: boolean;
  new_arrival: boolean;
  sale_badge: boolean;
  manual_badges: Product["manualBadges"];
  images: ProductImage[];
  specifications: Record<string, string>;
  features: string[];
  tags: string[];
  seo_title: string;
  seo_description: string;
  published: boolean;
  created_at: string;
  updated_at: string;
};

type DbBanner = {
  id: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  desktop_image: string;
  mobile_image: string;
  active: boolean;
  sort_order: number;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
};

type DbAnnouncement = {
  id: string;
  text: string;
  link: string | null;
  link_target: "_self" | "_blank";
  background_color: string;
  text_color: string;
  active: boolean;
  updated_at: string;
};

type DbHomepage = {
  id: string;
  featured_category_ids: string[];
  featured_product_ids: string[];
  best_seller_product_ids: string[];
  new_arrival_product_ids: string[];
  sale_product_ids: string[];
  marketing_banner_id: string | null;
  sections: HomepageConfig["sections"];
  updated_at: string;
};

type DbOrder = {
  id: string;
  order_number: string;
  customer: Order["customer"];
  items: Order["items"];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  payment_method: Order["paymentMethod"];
  status: Order["status"];
  created_at: string;
  updated_at: string;
};

export function mapCategory(row: DbCategory): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    image: row.image,
    featured: row.featured,
    sortOrder: row.sort_order,
    active: row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toDbCategory(
  c: Omit<Category, "createdAt" | "updatedAt"> &
    Partial<Pick<Category, "createdAt" | "updatedAt">>,
) {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    image: c.image,
    featured: c.featured,
    sort_order: c.sortOrder,
    active: c.active,
    created_at: c.createdAt,
    updated_at: c.updatedAt,
  };
}

export function mapProduct(row: DbProduct): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    sku: row.sku,
    categoryId: row.category_id,
    subcategory: row.subcategory ?? undefined,
    shortDescription: row.short_description,
    description: row.description,
    price: Number(row.price),
    salePrice: row.sale_price == null ? null : Number(row.sale_price),
    compareAtPrice:
      row.compare_at_price == null ? null : Number(row.compare_at_price),
    stockQuantity: row.stock_quantity,
    stockStatus: row.stock_status,
    featured: row.featured,
    bestSeller: row.best_seller,
    newArrival: row.new_arrival,
    saleBadge: row.sale_badge,
    manualBadges: row.manual_badges ?? [],
    images: row.images ?? [],
    specifications: row.specifications ?? {},
    features: row.features ?? [],
    tags: row.tags ?? [],
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    published: row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toDbProduct(
  p: Omit<Product, "createdAt" | "updatedAt"> &
    Partial<Pick<Product, "createdAt" | "updatedAt">>,
) {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    category_id: p.categoryId,
    subcategory: p.subcategory ?? null,
    short_description: p.shortDescription,
    description: p.description,
    price: p.price,
    sale_price: p.salePrice,
    compare_at_price: p.compareAtPrice,
    stock_quantity: p.stockQuantity,
    stock_status: p.stockStatus,
    featured: p.featured,
    best_seller: p.bestSeller,
    new_arrival: p.newArrival,
    sale_badge: p.saleBadge,
    manual_badges: p.manualBadges,
    images: p.images,
    specifications: p.specifications,
    features: p.features,
    tags: p.tags,
    seo_title: p.seoTitle,
    seo_description: p.seoDescription,
    published: p.published,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
  };
}

export function mapBanner(row: DbBanner): Banner {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    ctaText: row.cta_text,
    ctaLink: row.cta_link,
    desktopImage: row.desktop_image,
    mobileImage: row.mobile_image,
    active: row.active,
    sortOrder: row.sort_order,
    startDate: row.start_date,
    endDate: row.end_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toDbBanner(
  b: Omit<Banner, "createdAt" | "updatedAt"> &
    Partial<Pick<Banner, "createdAt" | "updatedAt">>,
) {
  return {
    id: b.id,
    title: b.title,
    subtitle: b.subtitle,
    cta_text: b.ctaText,
    cta_link: b.ctaLink,
    desktop_image: b.desktopImage,
    mobile_image: b.mobileImage,
    active: b.active,
    sort_order: b.sortOrder,
    start_date: b.startDate,
    end_date: b.endDate,
    created_at: b.createdAt,
    updated_at: b.updatedAt,
  };
}

export function mapAnnouncement(row: DbAnnouncement): AnnouncementBar {
  return {
    id: row.id,
    text: row.text,
    link: row.link,
    linkTarget: row.link_target,
    backgroundColor: row.background_color,
    textColor: row.text_color,
    active: row.active,
    updatedAt: row.updated_at,
  };
}

export function toDbAnnouncement(a: AnnouncementBar) {
  return {
    id: a.id,
    text: a.text,
    link: a.link,
    link_target: a.linkTarget,
    background_color: a.backgroundColor,
    text_color: a.textColor,
    active: a.active,
    updated_at: a.updatedAt,
  };
}

export function mapHomepage(row: DbHomepage): HomepageConfig {
  return {
    featuredCategoryIds: row.featured_category_ids ?? [],
    featuredProductIds: row.featured_product_ids ?? [],
    bestSellerProductIds: row.best_seller_product_ids ?? [],
    newArrivalProductIds: row.new_arrival_product_ids ?? [],
    saleProductIds: row.sale_product_ids ?? [],
    marketingBannerId: row.marketing_banner_id,
    sections: row.sections,
    updatedAt: row.updated_at,
  };
}

export function toDbHomepage(h: HomepageConfig) {
  return {
    id: "homepage",
    featured_category_ids: h.featuredCategoryIds,
    featured_product_ids: h.featuredProductIds,
    best_seller_product_ids: h.bestSellerProductIds,
    new_arrival_product_ids: h.newArrivalProductIds,
    sale_product_ids: h.saleProductIds,
    marketing_banner_id: h.marketingBannerId,
    sections: h.sections,
    updated_at: h.updatedAt,
  };
}

export function mapOrder(row: DbOrder): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    customer: row.customer,
    items: row.items,
    subtotal: Number(row.subtotal),
    discount: Number(row.discount),
    shipping: Number(row.shipping),
    total: Number(row.total),
    paymentMethod: row.payment_method,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toDbOrder(o: Order) {
  return {
    id: o.id,
    order_number: o.orderNumber,
    customer: o.customer,
    items: o.items,
    subtotal: o.subtotal,
    discount: o.discount,
    shipping: o.shipping,
    total: o.total,
    payment_method: o.paymentMethod,
    status: o.status,
    created_at: o.createdAt,
    updated_at: o.updatedAt,
  };
}
