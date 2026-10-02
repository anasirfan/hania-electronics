import type { AnnouncementBar, Banner, HomepageConfig, Order } from "@/domain/types";
import { mediaUrl } from "@/lib/media-url";

const now = "2026-09-22T00:00:00.000Z";

export const seedAnnouncement: AnnouncementBar = {
  id: "announce-1",
  text: "NEW ARRIVALS — LIGHT YOUR NIGHT & VOCO PREMIUM",
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
    subtitle: "Light Your Night, VOCO accessories, Style & Care, and Smart Living.",
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
    title: "Light your night, stay powered",
    subtitle: "Rechargeable bulbs and VOCO premium accessories — ready for Pakistani homes.",
    ctaText: "Shop Now",
    ctaLink: "/shop/light-your-night",
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
    "cat-light-your-night",
    "cat-voco-premium",
    "cat-style-care",
    "cat-smart-living",
  ],
  featuredProductIds: [
    "p-bulb-20w",
    "p-voco-s02",
    "p-voco-s03",
    "p-voco-w01",
    "p-voco-w02",
    "p-voco-w03",
  ],
  bestSellerProductIds: [
    "p-bulb-20w",
    "p-voco-p02",
    "p-voco-s02",
    "p-voco-w01",
  ],
  newArrivalProductIds: [
    "p-bulb-20w",
    "p-voco-l01ac",
    "p-voco-l01cc",
    "p-voco-p01",
    "p-voco-p02",
    "p-voco-p03",
    "p-voco-s01",
    "p-voco-s02",
    "p-voco-s03",
    "p-voco-w01",
    "p-voco-w02",
    "p-voco-w03",
  ],
  saleProductIds: [],
  marketingBannerId: "banner-3",
  sections: {
    categories: true,
    bestSellers: true,
    sale: false,
    newArrivals: true,
    featured: true,
    trust: true,
    marketingBanner: true,
    newsletter: true,
  },
  updatedAt: now,
};

export const seedOrders: Order[] = [];
