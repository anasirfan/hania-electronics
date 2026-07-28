/**
 * Photography system.
 *
 * `scenes/*` — curated environmental photography (one consistent blue-hour /
 * warm-practical-light world), unified via the `.cinematic` grade in globals.css.
 * `products/*` and `products-clean/*` — real product photography, normalized
 * onto neutral/dark backgrounds. Products without usable real photography fall
 * back to a crafted glow treatment in ProductVisual rather than a mismatched stock photo.
 */
export const media = {
  hero: "/scenes/bedroom-warm.webp",
  lifestyle: "/scenes/living-room-hero.webp",
  dealerBg: "/scenes/warehouse-showroom.webp",
  scenes: {
    home: "/scenes/living-room-hero.webp",
    office: null,
    camping: "/scenes/camping-night.webp",
    emergency: "/scenes/emergency-strip.webp",
    deskLamp: "/scenes/desk-lamp-c.webp",
    gardenLantern: "/scenes/garden-lantern-c.webp",
    headlampLifestyle: "/scenes/headlamp-lifestyle.webp",
  },
  categories: {
    torch: "/products/catalog/ayt-3188-mirror-torch.jpg",
    solar: "/products/catalog/cl-118-solar-wall-1.jpg",
    emergency: "/products/catalog/mh-8801-camping-lamp-1.jpg",
    "head-lamps": "/categories/head-lamps-c.webp",
    bulbs: "/products/catalog/ny-803a-headlamp-2.jpg",
    outdoor: "/products/catalog/hc-776a-outdoor-light.jpg",
    accessories: "/products/accessory.webp",
  },
  products: {
    torch: "/products/torch.webp",
    emergency: "/products-clean/emergency-flashlight.webp",
    headlamp: "/products-clean/headlamp.webp",
    solar: null,
    outdoor: null,
    bulb: "/products/solar-lantern.webp",
    camping: "/scenes/camping-tent-crop.webp",
    accessory: "/products/accessory.webp",
    industrial: "/products/industrial.webp",
  },
} as const;
