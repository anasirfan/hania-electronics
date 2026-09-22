import type { AnnouncementBar, Banner, HomepageConfig, Order } from "@/domain/types";
import { mediaUrl } from "@/lib/media-url";

const now = "2026-09-22T00:00:00.000Z";

export const seedAnnouncement: AnnouncementBar = {
  id: "announce-1",
  text: "20% OFF ON SELECTED PRODUCTS — SHOP NOW",
  link: "/shop?sale=1",
  linkTarget: "_self",
  backgroundColor: "#0B6BCB",
  textColor: "#FFFFFF",
  active: true,
  updatedAt: now,
};

export const seedBanners: Banner[] = [
  {
    id: "banner-1",
    title: "Light that works when you need it",
    subtitle: "Flash lights, metal lights & solar — ready for Pakistani homes.",
    ctaText: "Shop Collection",
    ctaLink: "/shop",
    desktopImage: mediaUrl("/media/hero/living-room.webp"),
    mobileImage: mediaUrl("/media/hero/living-room.webp"),
    active: true,
    sortOrder: 1,
    startDate: null,
    endDate: null,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "banner-2",
    title: "Solar nights, brighter savings",
    subtitle: "Explore rechargeable solar lanterns and outdoor lights.",
    ctaText: "Shop Solar",
    ctaLink: "/shop/solar-lights",
    desktopImage: mediaUrl("/media/products/camping.webp"),
    mobileImage: mediaUrl("/media/products/camping.webp"),
    active: true,
    sortOrder: 2,
    startDate: null,
    endDate: null,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "banner-3",
    title: "Wholesale partners welcome",
    subtitle: "Become a Hania dealer for distributor pricing across Pakistan.",
    ctaText: "Become a Dealer",
    ctaLink: "/become-a-dealer",
    desktopImage: mediaUrl("/media/brand/dealer-bg.webp"),
    mobileImage: mediaUrl("/media/brand/dealer-bg.webp"),
    active: true,
    sortOrder: 3,
    startDate: null,
    endDate: null,
    createdAt: now,
    updatedAt: now,
  },
];

export const seedHomepage: HomepageConfig = {
  featuredCategoryIds: [
    "cat-metal-lights",
    "cat-flash-lights",
    "cat-solar-lights",
  ],
  featuredProductIds: ["p-001", "p-008", "p-017", "p-025"],
  bestSellerProductIds: ["p-001", "p-002", "p-008", "p-017", "p-020", "p-025"],
  newArrivalProductIds: ["p-004", "p-007", "p-011", "p-018", "p-021", "p-027"],
  saleProductIds: ["p-001", "p-002", "p-004", "p-006", "p-017", "p-019"],
  marketingBannerId: "banner-3",
  sections: {
    categories: true,
    bestSellers: true,
    sale: true,
    newArrivals: true,
    featured: true,
    trust: true,
    marketingBanner: true,
    newsletter: true,
  },
  updatedAt: now,
};

export const seedOrders: Order[] = [];
