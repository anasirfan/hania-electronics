import type { Category } from "@/features/products/types";
import { media } from "@/data/catalog/media";

export const categories: Category[] = [
  {
    id: "torch",
    name: "Torch",
    description: "Professional beam torches",
    image: media.categories.torch,
  },
  {
    id: "solar",
    name: "Solar",
    description: "Solar-powered lighting",
    image: media.categories.solar,
  },
  {
    id: "emergency",
    name: "Emergency",
    description: "Backup safety lights",
    image: media.categories.emergency,
  },
  {
    id: "head-lamps",
    name: "Head Lamps",
    description: "Hands-free lighting",
    image: media.categories["head-lamps"],
  },
  {
    id: "bulbs",
    name: "Bulbs",
    description: "Efficient home bulbs",
    image: media.categories.bulbs,
  },
  {
    id: "outdoor",
    name: "Outdoor",
    description: "Exterior & site lights",
    image: media.categories.outdoor,
  },
  {
    id: "accessories",
    name: "Accessories",
    description: "Everyday essentials",
    image: media.categories.accessories,
  },
];
