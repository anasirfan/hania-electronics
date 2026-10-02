import type { Category } from "@/domain/types";

const now = "2026-10-02T13:40:04.519Z";

export const seedCategories: Category[] = [
  {
    id: "cat-light-your-night",
    name: "Light Your Night",
    slug: "light-your-night",
    description: "Rechargeable bulbs and backup lighting for every blackout.",
    image: "https://exsbgevvotsljjkdcloh.supabase.co/storage/v1/object/public/uploads/media/categories/light-your-night.jpg",
    featured: true,
    sortOrder: 1,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "cat-voco-premium",
    name: "VOCO Premium Accessories",
    slug: "voco-premium-accessories",
    description: "Cables, chargers, earbuds and smartwatches by VOCO.",
    image: "https://exsbgevvotsljjkdcloh.supabase.co/storage/v1/object/public/uploads/media/categories/voco-premium-accessories.jpg",
    featured: true,
    sortOrder: 2,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "cat-style-care",
    name: "Style & Care",
    slug: "style-care",
    description: "Personal care and style essentials for everyday confidence.",
    image: "https://exsbgevvotsljjkdcloh.supabase.co/storage/v1/object/public/uploads/media/categories/style-care.jpg",
    featured: true,
    sortOrder: 3,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "cat-smart-living",
    name: "Smart Living",
    slug: "smart-living",
    description: "Smart home gadgets that make daily life easier.",
    image: "https://exsbgevvotsljjkdcloh.supabase.co/storage/v1/object/public/uploads/media/categories/smart-living.jpg",
    featured: true,
    sortOrder: 4,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
];
