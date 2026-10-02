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
    "light-your-night": mediaUrl("/media/categories/light-your-night.jpg"),
    "voco-premium-accessories": mediaUrl(
      "/media/categories/voco-premium-accessories.jpg",
    ),
    "style-care": mediaUrl("/media/categories/style-care.jpg"),
    "smart-living": mediaUrl("/media/categories/smart-living.jpg"),
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
