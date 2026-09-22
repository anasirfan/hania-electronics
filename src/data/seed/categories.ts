import type { Category } from "@/domain/types";
import { mediaUrl } from "@/lib/media-url";

const now = "2026-09-22T00:00:00.000Z";

export const seedCategories: Category[] = [
  {
    id: "cat-metal-lights",
    name: "Metal Lights",
    slug: "metal-lights",
    description: "Durable metal body lights for home and work.",
    image: mediaUrl("/media/categories/metal-lights.webp"),
    featured: true,
    sortOrder: 1,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "cat-flash-lights",
    name: "Flash Lights",
    slug: "flash-lights",
    description: "Professional torches and tactical flashlights.",
    image: mediaUrl("/media/categories/flash-lights.webp"),
    featured: true,
    sortOrder: 2,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "cat-solar-lights",
    name: "Solar Lights",
    slug: "solar-lights",
    description: "Solar-powered lanterns and outdoor lighting.",
    image: mediaUrl("/media/categories/solar-lights.webp"),
    featured: true,
    sortOrder: 3,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
];
