/**
 * Photography system — all assets live in Supabase Storage (`uploads` bucket).
 * Paths are site-relative keys under the bucket; `mediaUrl()` resolves them.
 */
import { mediaUrl } from "@/lib/media-url";

export const media = {
  hero: mediaUrl("/scenes/bedroom-warm.webp"),
  lifestyle: mediaUrl("/scenes/living-room-hero.webp"),
  dealerBg: mediaUrl("/media/brand/dealer-bg.webp"),
  scenes: {
    home: mediaUrl("/scenes/living-room-hero.webp"),
    office: null as string | null,
    camping: mediaUrl("/scenes/camping-night.webp"),
    emergency: mediaUrl("/scenes/emergency-strip.webp"),
    deskLamp: mediaUrl("/scenes/desk-lamp-c.webp"),
    gardenLantern: mediaUrl("/scenes/garden-lantern-c.webp"),
    headlampLifestyle: mediaUrl("/scenes/headlamp-lifestyle.webp"),
  },
  categories: {
    torch: mediaUrl("/media/categories/torch.webp"),
    solar: mediaUrl("/media/categories/solar.webp"),
    emergency: mediaUrl("/media/categories/emergency.webp"),
    "head-lamps": mediaUrl("/media/categories/head-lamps-c.webp"),
    bulbs: mediaUrl("/media/categories/bulbs.webp"),
    outdoor: mediaUrl("/media/categories/outdoor.webp"),
    accessories: mediaUrl("/media/categories/accessories.webp"),
  },
  products: {
    torch: mediaUrl("/media/products/torch.webp"),
    emergency: mediaUrl("/media/products/emergency.webp"),
    headlamp: mediaUrl("/media/products/headlamp.webp"),
    solar: null as string | null,
    outdoor: null as string | null,
    bulb: mediaUrl("/media/products/bulb.webp"),
    camping: mediaUrl("/media/products/camping.webp"),
    accessory: mediaUrl("/media/products/accessory.webp"),
    industrial: mediaUrl("/media/products/industrial.webp"),
  },
} as const;
