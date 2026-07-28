export interface ProductSpec {
  label: string;
  value: string;
}

export interface SpecGroup {
  title: string;
  items: ProductSpec[];
}

export interface WhyBuyPoint {
  icon: string;
  headline: string;
  body: string;
}

export interface ProductUseCase {
  title: string;
  description: string;
  scene: string | null;
  purpose: string;
}

export interface ProductFaqItem {
  question: string;
  answer: string;
}

export interface ProductDetail {
  productId: string;
  tagline: string;
  editorial: string;
  warranty: string;
  delivery: string;
  gallery: (string | null)[];
  specGroups: SpecGroup[];
  whyBuy: WhyBuyPoint[];
  useCases: ProductUseCase[];
  faqs: ProductFaqItem[];
}

const details: ProductDetail[] = [
  {
    productId: "p-led-torch",
    tagline: "450 lumens. One switch. Ready when it matters.",
    editorial:
      "Built for the moments when you can't afford failure. The Multi-Function LED Torch delivers a precise, far-reaching beam that cuts through complete darkness — whether it's a power outage at home, a late-night job site, or an emergency on the road. Military-grade aluminium body. IP64 water resistance. Always in your pocket, always ready.",
    warranty: "6 months",
    delivery: "2–5 days across Pakistan",
    gallery: [
      "/products/torch.webp",
      "/scenes/headlamp-lifestyle.webp",
      "/scenes/building-night.webp",
    ],
    specGroups: [
      {
        title: "Light Output",
        items: [
          { label: "Lumens", value: "450 lm" },
          { label: "Beam Distance", value: "305 m (1,000 ft)" },
          { label: "Modes", value: "High / Low / Strobe / SOS" },
        ],
      },
      {
        title: "Power",
        items: [
          { label: "Battery", value: "Lithium-Ion (included)" },
          { label: "Charge Time", value: "3–4 hours" },
          { label: "Runtime (High)", value: "Up to 4 hours" },
          { label: "Runtime (Low)", value: "Up to 10 hours" },
        ],
      },
      {
        title: "Build",
        items: [
          { label: "Body", value: "Aircraft-grade aluminium" },
          { label: "Water Resistance", value: "IP64 rated" },
          { label: "Weight", value: "180 g" },
          { label: "Length", value: "145 mm" },
        ],
      },
    ],
    whyBuy: [
      {
        icon: "Zap",
        headline: "Instant-on, every time.",
        body: "A single press delivers full beam with no warm-up. When you need light, you need it now — not after a delay.",
      },
      {
        icon: "Battery",
        headline: "All-day battery life.",
        body: "Up to 10 hours on low mode means one charge takes you through an entire day's work — and the next night too.",
      },
      {
        icon: "Shield",
        headline: "Rated for Pakistan's climate.",
        body: "IP64 handles monsoon rain, dusty construction sites, and humid coastal environments without complaint.",
      },
      {
        icon: "Package",
        headline: "Pocket-sized. Full-power.",
        body: "At 145 mm and 180 g, it disappears in your pocket but delivers the beam of a torch twice its size.",
      },
    ],
    useCases: [
      {
        title: "Power Outages",
        description:
          "Keep one in every room. Instant light when the grid goes down.",
        scene: "/scenes/desk-lamp-c.webp",
        purpose: "home",
      },
      {
        title: "Night Travel",
        description: "Illuminate dark roads, engine bays, and pathways.",
        scene: "/scenes/headlamp-lifestyle.webp",
        purpose: "travel",
      },
      {
        title: "Job Sites",
        description: "A tool for tradespeople — surveyors, electricians, plumbers.",
        scene: "/scenes/building-night.webp",
        purpose: "construction",
      },
      {
        title: "Outdoor Nights",
        description: "From campfire setups to midnight trail navigation.",
        scene: "/scenes/camping-night.webp",
        purpose: "camping",
      },
    ],
    faqs: [
      {
        question: "Can I replace the battery?",
        answer:
          "Yes. The lithium-ion cell is standard 18650 format and replaceable. Replacement cells are widely available across Pakistan.",
      },
      {
        question: "How long does charging take?",
        answer:
          "A full charge takes 3–4 hours via the included USB cable. A 30-minute partial charge gives approximately 2 hours of low-mode runtime.",
      },
      {
        question: "Is it really waterproof?",
        answer:
          "IP64 means fully dust-proof and protected against splashing water from any direction. It handles monsoon rain and job-site splashes — not submersion.",
      },
      {
        question: "What's covered by the warranty?",
        answer:
          "6 months from purchase date. Manufacturing defects covered. WhatsApp our support team with your order details for fast resolution.",
      },
    ],
  },

  {
    productId: "p-emergency-8in1",
    tagline: "Eight tools. One hand. Zero excuses.",
    editorial:
      "Engineered for the moments that catch you off guard. The 8-in-1 Emergency Flashlight isn't just a light — it's the difference between a close call and a real crisis. Flood the scene, charge your phone, break a window, cut a seatbelt, and signal for help, all from a single device that fits in your glove box.",
    warranty: "6 months",
    delivery: "2–5 days across Pakistan",
    gallery: [
      "/products-clean/emergency-flashlight.webp",
      "/scenes/emergency-strip.webp",
      "/scenes/camping-night.webp",
    ],
    specGroups: [
      {
        title: "Power Bank",
        items: [
          { label: "Battery Capacity", value: "2000 mAh" },
          { label: "USB Output", value: "5V / 1A" },
          { label: "Charge Time", value: "2–3 hours" },
          { label: "Phone Charges", value: "Approx. 0.5–1 full charge" },
        ],
      },
      {
        title: "Light",
        items: [
          { label: "Technology", value: "COB + LED" },
          { label: "Modes", value: "Flood / Spot / Strobe / SOS" },
          { label: "Runtime", value: "Up to 6 hours" },
        ],
      },
      {
        title: "Safety Tools",
        items: [
          { label: "Safety Hammer", value: "Hardened steel tip" },
          { label: "Seatbelt Cutter", value: "Recessed stainless blade" },
          { label: "Emergency Alarm", value: "120 dB" },
          { label: "Weight", value: "220 g" },
        ],
      },
    ],
    whyBuy: [
      {
        icon: "Plug",
        headline: "Your phone stays alive.",
        body: "2000 mAh built-in power bank charges your phone during extended outages or after an accident — when staying connected is critical.",
      },
      {
        icon: "AlertTriangle",
        headline: "Designed for real emergencies.",
        body: "The hardened steel hammer breaks car windows. The recessed blade cuts seatbelts. These aren't gimmicks — they're tools that can save a life.",
      },
      {
        icon: "Volume2",
        headline: "120 dB alarm cuts through noise.",
        body: "Loud enough to be heard over traffic, crowds, and construction. Signal your location when you can't be seen.",
      },
      {
        icon: "Car",
        headline: "Built for your glove box.",
        body: "Compact enough to live in your car permanently. Every Pakistani driver should have one — and many do.",
      },
    ],
    useCases: [
      {
        title: "Car Accidents",
        description:
          "Break windows, cut seatbelts, signal rescuers — all from one device.",
        scene: "/scenes/emergency-strip.webp",
        purpose: "emergency",
      },
      {
        title: "Extended Outages",
        description: "Flood your room with light and keep your phone charged for hours.",
        scene: "/scenes/desk-lamp-c.webp",
        purpose: "home",
      },
      {
        title: "Long Road Trips",
        description: "Peace of mind for highways, mountain passes, and night drives.",
        scene: "/scenes/headlamp-lifestyle.webp",
        purpose: "travel",
      },
      {
        title: "Remote Camping",
        description: "Emergency signaling, camp illumination, and phone power in one.",
        scene: "/scenes/camping-night.webp",
        purpose: "camping",
      },
    ],
    faqs: [
      {
        question: "Can it actually charge a modern smartphone?",
        answer:
          "Yes. The 2000 mAh bank provides approximately 0.5–1 full charge for a modern smartphone. It's designed for emergency use, not daily top-ups.",
      },
      {
        question: "How strong is the safety hammer?",
        answer:
          "The hardened steel tip is designed to break tempered car windows with a single firm strike to the corner. Same principle as professional rescue tools.",
      },
      {
        question: "Is the belt cutter sharp enough?",
        answer:
          "Yes. The recessed stainless blade cuts through standard seatbelt fabric in a single pull motion. One-handed use, designed for stress situations.",
      },
      {
        question: "How do I know when the battery is low?",
        answer:
          "An LED indicator shows charge level. We recommend recharging after every use and keeping it topped up for true emergency readiness.",
      },
    ],
  },

  {
    productId: "p-headlamp",
    tagline: "Light where you look. Always.",
    editorial:
      "When your hands are full, the Eye-Safe Headlamp keeps your world illuminated without compromise. A battery indicator so you're never caught off guard, a soft-diffused beam that protects your eyes over extended use, and USB-C charging so any cable you own can keep it running.",
    warranty: "6 months",
    delivery: "2–5 days across Pakistan",
    gallery: [
      "/products-clean/headlamp.webp",
      "/scenes/headlamp-lifestyle.webp",
      "/scenes/camping-night.webp",
    ],
    specGroups: [
      {
        title: "Light Output",
        items: [
          { label: "Lumens", value: "300 lm" },
          { label: "Beam Angle", value: "Wide (120°) + Spot (15°)" },
          { label: "Modes", value: "High / Low / Wide / Red / SOS" },
          { label: "Red Mode", value: "Night-vision preserving" },
        ],
      },
      {
        title: "Power",
        items: [
          { label: "Battery", value: "1200 mAh built-in" },
          { label: "Charging", value: "USB-C" },
          { label: "Charge Time", value: "2 hours" },
          { label: "Runtime (High)", value: "3–4 hours" },
          { label: "Runtime (Low)", value: "8–10 hours" },
          { label: "Battery Display", value: "4-level LED indicator" },
        ],
      },
      {
        title: "Comfort & Build",
        items: [
          { label: "Head Strap", value: "Adjustable silicone" },
          { label: "Tilt Range", value: "45° adjustable" },
          { label: "Weight", value: "85 g" },
          { label: "Water Resistance", value: "IPX4" },
        ],
      },
    ],
    whyBuy: [
      {
        icon: "Eye",
        headline: "Easy on your eyes.",
        body: "The diffused wide beam eliminates harsh hotspots that cause eye fatigue — essential for mechanics and electricians working for hours.",
      },
      {
        icon: "Battery",
        headline: "Know exactly how much battery you have.",
        body: "The 4-level LED indicator means you'll never be surprised by a dead headlamp in the middle of a job.",
      },
      {
        icon: "Zap",
        headline: "The cable you already have.",
        body: "USB-C means your phone charger, your laptop charger, your power bank — any cable works. No proprietary connectors.",
      },
      {
        icon: "Moon",
        headline: "Red mode for night vision.",
        body: "Preserve your natural night vision while moving through dark environments — essential for camping, astronomy, and low-light safety.",
      },
    ],
    useCases: [
      {
        title: "Mechanical Work",
        description: "Both hands on the engine while the light follows your gaze.",
        scene: "/scenes/building-night.webp",
        purpose: "construction",
      },
      {
        title: "Camp Life",
        description: "Cook, set up tents, and navigate trails without carrying anything.",
        scene: "/scenes/camping-night.webp",
        purpose: "camping",
      },
      {
        title: "Technical Inspection",
        description: "Peer into tight spaces with exactly the light you need.",
        scene: "/scenes/headlamp-lifestyle.webp",
        purpose: "industrial",
      },
      {
        title: "Home Repairs",
        description:
          "Under sinks, above ceiling fans, inside switchboxes — the headlamp is the electrician's best friend.",
        scene: "/scenes/desk-lamp-c.webp",
        purpose: "home",
      },
    ],
    faqs: [
      {
        question: "How adjustable is the beam angle?",
        answer:
          "The head unit tilts 45° downward from horizontal — enough to light the floor while standing, or illuminate your lap while seated.",
      },
      {
        question: "Does the red mode really preserve night vision?",
        answer:
          "Yes. Red light doesn't cause your pupils to constrict like white light does, so switching back to darkness is much faster and easier on your eyes.",
      },
      {
        question: "Can I wear it over a helmet?",
        answer:
          "The silicone strap is fully adjustable and wide enough to fit over most hard hats and construction helmets. Designed for workplace use.",
      },
      {
        question: "Is the USB-C port protected from water?",
        answer:
          "The port has a rubber cover that should be closed in wet conditions. IPX4 means it handles rain and splashes — not submersion.",
      },
    ],
  },

  {
    productId: "p-solar-lantern",
    tagline: "The sun powers it. You don't have to.",
    editorial:
      "Where electricity is unreliable, the Solar Power Lantern doesn't ask questions — it just works. Charge it in sunlight, hang it in any room, and let it run all night. Warm, diffused 3000K light that feels like a table lamp, powered entirely by the Pakistani sun.",
    warranty: "1 year",
    delivery: "2–5 days across Pakistan",
    gallery: [null, "/scenes/desk-lamp-c.webp", "/scenes/garden-lantern-c.webp"],
    specGroups: [
      {
        title: "Solar",
        items: [
          { label: "Panel", value: "Monocrystalline silicon" },
          { label: "Solar Charge Time", value: "6–8 hours (full sun)" },
          { label: "USB Backup", value: "Micro-USB" },
          { label: "USB Charge Time", value: "3 hours" },
        ],
      },
      {
        title: "Light",
        items: [
          { label: "Color Temperature", value: "3000K (warm white)" },
          { label: "Modes", value: "High / Low / Flash" },
          { label: "Runtime (High)", value: "8 hours" },
          { label: "Runtime (Low)", value: "16+ hours" },
        ],
      },
      {
        title: "Build",
        items: [
          { label: "Battery", value: "2200 mAh Li-ion" },
          { label: "Hanging Hook", value: "Built-in" },
          { label: "Foldable Panel", value: "Yes" },
          { label: "Weight", value: "320 g" },
        ],
      },
    ],
    whyBuy: [
      {
        icon: "Sun",
        headline: "Zero electricity required.",
        body: "4–6 hours of Pakistani sunlight provides a full night of illumination. No meter. No bills. No power cuts that affect it.",
      },
      {
        icon: "Clock",
        headline: "16 hours from a single charge.",
        body: "On low mode, one full solar charge runs the entire night and well into the next day. Set it and forget it.",
      },
      {
        icon: "Home",
        headline: "Warm light that feels like home.",
        body: "3000K warm white glow is easy on the eyes — not the harsh blue-white of a work light. Creates a comfortable atmosphere anywhere.",
      },
      {
        icon: "Hammer",
        headline: "Backup USB when clouds come.",
        body: "Overcast day? Plug it into any power bank or wall adapter. Solar is the first choice, not the only one.",
      },
    ],
    useCases: [
      {
        title: "Off-Grid Homes",
        description: "Hang it in any room that needs reliable, no-cost evening light.",
        scene: "/scenes/desk-lamp-c.webp",
        purpose: "home",
      },
      {
        title: "Outdoor Camping",
        description: "Hang from a tree branch and illuminate your entire camp.",
        scene: "/scenes/camping-night.webp",
        purpose: "camping",
      },
      {
        title: "Load Shedding",
        description: "Never left in the dark again — even multi-hour outages don't touch it.",
        scene: "/scenes/emergency-strip.webp",
        purpose: "emergency",
      },
      {
        title: "Gardens & Verandas",
        description: "Warm evening ambiance for outdoor sitting — powered by daylight.",
        scene: "/scenes/garden-lantern-c.webp",
        purpose: "home",
      },
    ],
    faqs: [
      {
        question: "Does it work on cloudy days?",
        answer:
          "Yes, but partially. Diffused sunlight still charges the panel — more slowly. A full overcast day provides roughly 30–40% of a clear-day charge. The USB backup is designed for these situations.",
      },
      {
        question: "Can I use it while it's charging from solar?",
        answer:
          "Yes. The solar panel and light operate independently. Charging while using reduces net battery draw, extending total available runtime.",
      },
      {
        question: "How do I know when the battery is full?",
        answer:
          "An LED indicator shows charging status and battery level. Green indicates fully charged.",
      },
      {
        question: "Can it hang indoors?",
        answer:
          "Absolutely. The built-in hook fits any hook, nail, or hanging point. Many customers hang it in rooms, shops, and kitchens as their primary light source.",
      },
    ],
  },

  {
    productId: "p-cob-worklight",
    tagline: "Flood the darkness. Get to work.",
    editorial:
      "The COB Work Floodlight turns any surface into a work surface. Wide-angle chip-on-board illumination covers an entire workshop bay or job-site alcove without shadows or hotspots. Magnetic base. Rechargeable. Built to survive a Pakistani construction season.",
    warranty: "6 months",
    delivery: "2–5 days across Pakistan",
    gallery: [null, "/scenes/building-night.webp", "/scenes/camping-night.webp"],
    specGroups: [
      {
        title: "Light",
        items: [
          { label: "Technology", value: "COB (Chip-on-Board)" },
          { label: "Beam Angle", value: "180° flood" },
          { label: "Color Temperature", value: "6000K (cool white)" },
          { label: "Modes", value: "High / Low" },
        ],
      },
      {
        title: "Power",
        items: [
          { label: "Battery", value: "4000 mAh Li-ion" },
          { label: "Charging", value: "USB-C" },
          { label: "Charge Time", value: "4–5 hours" },
          { label: "Runtime (High)", value: "4 hours" },
          { label: "Runtime (Low)", value: "8 hours" },
        ],
      },
      {
        title: "Mount",
        items: [
          { label: "Magnetic Base", value: "Neodymium magnet" },
          { label: "Foldable Stand", value: "Yes" },
          { label: "Hanging Hook", value: "Built-in" },
          { label: "Weight", value: "380 g" },
        ],
      },
    ],
    whyBuy: [
      {
        icon: "Zap",
        headline: "No shadows. No blind spots.",
        body: "COB technology spreads light evenly across 180°. You don't need to reposition it every 5 minutes — it lights everything.",
      },
      {
        icon: "Magnet",
        headline: "Sticks where you need it.",
        body: "Neodymium magnetic base grips steel beams, engine bays, scaffolding — hands-free, angle-adjustable, wherever you need it.",
      },
      {
        icon: "Battery",
        headline: "Four hours of full-power flood.",
        body: "4000 mAh gets you through a full morning shift on high. Switch to low and it runs all day.",
      },
      {
        icon: "Wrench",
        headline: "Three mounting options.",
        body: "Magnet, fold-out stand, or hanging hook. Three ways to set it — the light adapts to your workspace, not the other way around.",
      },
    ],
    useCases: [
      {
        title: "Construction Sites",
        description: "Portable floodlight for any corner of the build.",
        scene: "/scenes/building-night.webp",
        purpose: "construction",
      },
      {
        title: "Workshop Bays",
        description: "Flood your entire workbench without a single shadow.",
        scene: "/scenes/building-night.webp",
        purpose: "industrial",
      },
      {
        title: "Campsite Setup",
        description: "Light an entire tent area from a single magnetic mount.",
        scene: "/scenes/camping-night.webp",
        purpose: "camping",
      },
      {
        title: "Night Emergencies",
        description: "Illuminate accident scenes, engine bays, and roadside repairs.",
        scene: "/scenes/emergency-strip.webp",
        purpose: "emergency",
      },
    ],
    faqs: [
      {
        question: "How strong is the magnet?",
        answer:
          "The neodymium magnet holds the light firmly on vertical steel surfaces at the device's full weight. Not designed for overhead mounting — use the hook or stand for that.",
      },
      {
        question: "Can I charge it from a car's USB port?",
        answer:
          "Yes. The USB-C input works with any 5V USB source including car adapters, power banks, and wall chargers.",
      },
      {
        question: "How hot does it get in use?",
        answer:
          "The aluminium body acts as a heat sink. Surface temperature remains safe to touch briefly during high mode — avoid extended contact on the front panel.",
      },
      {
        question: "Is it splash-proof?",
        answer:
          "It handles light rain and splash. Not rated for heavy rain or submersion. For outdoor use in monsoon conditions, position it under a roof or overhang.",
      },
    ],
  },

  {
    productId: "p-led-bulb",
    tagline: "Better light. Lower bill. Three at once.",
    editorial:
      "Clean, natural white light from bulbs that last years, not months. The Premium LED Bulb Pack replaces three incandescent or CFL bulbs at once — immediately cutting your electricity use while delivering flicker-free, consistent light that's easier on the eyes.",
    warranty: "1 year",
    delivery: "2–5 days across Pakistan",
    gallery: [
      "/products/solar-lantern.webp",
      "/scenes/desk-lamp-c.webp",
      "/scenes/living-room-hero.webp",
    ],
    specGroups: [
      {
        title: "Performance",
        items: [
          { label: "Power", value: "9W per bulb" },
          { label: "Equivalent Output", value: "60W incandescent" },
          { label: "Color Temperature", value: "6500K (cool daylight)" },
          { label: "Color Accuracy (CRI)", value: ">80" },
        ],
      },
      {
        title: "Efficiency",
        items: [
          { label: "Energy Savings", value: "~85% vs incandescent" },
          { label: "Lifespan", value: "15,000 hours" },
          { label: "Flicker", value: "Flicker-free" },
          { label: "Warm-up Time", value: "Instant (< 0.5 s)" },
        ],
      },
      {
        title: "Compatibility",
        items: [
          { label: "Base", value: "E27 (standard screw)" },
          { label: "Pack Quantity", value: "3 bulbs" },
          { label: "Voltage", value: "200–240V" },
          { label: "Dimmable", value: "No" },
        ],
      },
    ],
    whyBuy: [
      {
        icon: "TrendingDown",
        headline: "Cut your light bill immediately.",
        body: "9W vs 60W — same brightness, 85% less electricity. Three in the pack means converting an entire room in one go.",
      },
      {
        icon: "Clock",
        headline: "15,000 hours of service.",
        body: "Used 8 hours a day, these bulbs last over 5 years. No more hunting for bulbs at midnight when one blows.",
      },
      {
        icon: "Sun",
        headline: "Clean, accurate color.",
        body: "CRI >80 means colors look true — important for reading, cooking, and any work requiring accurate color perception.",
      },
      {
        icon: "Lightbulb",
        headline: "On instantly. No flickering.",
        body: "Full brightness in under half a second, no strobing. Just consistent, steady light from the moment you flip the switch.",
      },
    ],
    useCases: [
      {
        title: "Living Rooms",
        description: "Replace your main room lights for immediate energy savings.",
        scene: "/scenes/living-room-hero.webp",
        purpose: "home",
      },
      {
        title: "Home Offices",
        description: "Consistent color temperature reduces eye strain over long work sessions.",
        scene: "/scenes/desk-lamp-c.webp",
        purpose: "office",
      },
      {
        title: "Kitchens & Bathrooms",
        description: "Instant-on, accurate color for task lighting and daily routines.",
        scene: "/scenes/desk-lamp-c.webp",
        purpose: "home",
      },
      {
        title: "Shops & Showrooms",
        description: "True color rendering makes products and spaces look their best.",
        scene: "/scenes/building-night.webp",
        purpose: "office",
      },
    ],
    faqs: [
      {
        question: "Do these work with dimmers?",
        answer:
          "These are non-dimmable. They require a standard on/off switch. Connecting them to a dimmer circuit may cause flickering or premature failure.",
      },
      {
        question: "Will they fit all E27 sockets?",
        answer:
          "Yes. E27 is the standard screw base used in most Pakistani homes and offices. If your existing bulbs have an E27 base, these will fit.",
      },
      {
        question: "How does the lifespan compare to CFL?",
        answer:
          "A typical CFL lasts 6,000–10,000 hours. These LED bulbs are rated for 15,000 hours — longer, with no mercury and instant startup.",
      },
      {
        question: "Are these warm white or cool white?",
        answer:
          "These are 6500K cool daylight white — preferred for workspaces, study rooms, and commercial settings. For warm white (3000K), ask us via WhatsApp.",
      },
    ],
  },

  {
    productId: "p-camping-lantern",
    tagline: "Compact enough to forget. Bright enough to remember.",
    editorial:
      "The Compact Camping Lantern hangs from your bag all day and lights your entire camp at night. Multiple brightness modes, a sturdy carabiner hook, USB-C charging, and shock-resistance designed for the unpredictability of the outdoors.",
    warranty: "6 months",
    delivery: "2–5 days across Pakistan",
    gallery: [null, "/scenes/camping-night.webp", "/scenes/garden-lantern-c.webp"],
    specGroups: [
      {
        title: "Light",
        items: [
          { label: "Modes", value: "High / Mid / Low / Flicker" },
          { label: "Diffuser", value: "360° frosted panel" },
          { label: "Color", value: "3000K warm white" },
          { label: "Runtime (High)", value: "6 hours" },
          { label: "Runtime (Low)", value: "20+ hours" },
        ],
      },
      {
        title: "Power",
        items: [
          { label: "Battery", value: "2000 mAh Li-ion" },
          { label: "Charging", value: "USB-C" },
          { label: "Charge Time", value: "2–3 hours" },
        ],
      },
      {
        title: "Build",
        items: [
          { label: "Hook", value: "Carabiner-style stainless" },
          { label: "Drop Test", value: "1.5 m rated" },
          { label: "Water Resistance", value: "IPX4" },
          { label: "Weight", value: "145 g" },
          { label: "Height", value: "95 mm" },
        ],
      },
    ],
    whyBuy: [
      {
        icon: "Tent",
        headline: "One lantern. Entire campsite.",
        body: "360° diffused light with no dead zones or shadows. Hang it from a tree and light the whole area — no torch positioning required.",
      },
      {
        icon: "Feather",
        headline: "145 grams. Barely there.",
        body: "At 145 g and 95 mm collapsed, it fits in a trouser pocket. You'll forget you packed it until you need it.",
      },
      {
        icon: "Flame",
        headline: "Campfire flicker mode.",
        body: "A pulsing warm-white mode mimics campfire glow — atmosphere for outdoor dinners without the fire hazard.",
      },
      {
        icon: "Clock",
        headline: "20+ hours on low.",
        body: "One charge provides low-mode ambiance for multiple nights of camping without access to electricity.",
      },
    ],
    useCases: [
      {
        title: "Tent Camping",
        description: "Hang inside your tent for ambient light without shadows.",
        scene: "/scenes/camping-night.webp",
        purpose: "camping",
      },
      {
        title: "Backpacking",
        description: "Ultra-light at 145 g — earns every gram of its pack weight.",
        scene: "/scenes/headlamp-lifestyle.webp",
        purpose: "travel",
      },
      {
        title: "Power Outages",
        description: "Quiet, warm light for extended home outages.",
        scene: "/scenes/desk-lamp-c.webp",
        purpose: "emergency",
      },
      {
        title: "Outdoor Dining",
        description: "Garden dinners, roof gatherings, and veranda evenings lit beautifully.",
        scene: "/scenes/garden-lantern-c.webp",
        purpose: "home",
      },
    ],
    faqs: [
      {
        question: "Can I hang it from a backpack?",
        answer:
          "Yes. The stainless carabiner hook clips to any backpack loop, tent gear loop, or tree branch. Many users keep it clipped and accessible all day.",
      },
      {
        question: "What is the flicker mode for?",
        answer:
          "The flicker mode pulses light at a campfire-like frequency and warm color — it creates atmosphere and uses less battery than steady high mode.",
      },
      {
        question: "Is it submersible?",
        answer:
          "No. IPX4 means it handles rain and splashing from any direction but should not be submerged. Don't leave it out in heavy downpours without shelter.",
      },
      {
        question: "Does it work as a power bank?",
        answer:
          "No. This model does not have USB output for charging other devices. For power bank functionality, see our 8-in-1 Emergency Flashlight.",
      },
    ],
  },

  {
    productId: "p-trimmer",
    tagline: "Clean lines. Every morning. Without the cord.",
    editorial:
      "A trimmer designed for daily use without the clutter. Cordless, precise, and built with hardened steel blades that stay sharp through months of regular grooming. The travel lock means it won't turn on in your bag — one less thing to think about.",
    warranty: "6 months",
    delivery: "2–5 days across Pakistan",
    gallery: [
      "/products/accessory.webp",
      "/scenes/desk-lamp-c.webp",
      "/scenes/headlamp-lifestyle.webp",
    ],
    specGroups: [
      {
        title: "Performance",
        items: [
          { label: "Motor", value: "Rotary motor" },
          { label: "Blade", value: "Hardened stainless steel" },
          { label: "Blade Width", value: "40 mm" },
          { label: "Guides Included", value: "1 mm, 2 mm, 3 mm, 5 mm" },
        ],
      },
      {
        title: "Power",
        items: [
          { label: "Battery", value: "Li-ion (built-in)" },
          { label: "Charge Time", value: "1.5 hours" },
          { label: "Runtime", value: "60 minutes" },
          { label: "Charging", value: "USB-C" },
        ],
      },
      {
        title: "Design",
        items: [
          { label: "Finish", value: "Matte black" },
          { label: "Travel Lock", value: "Yes" },
          { label: "Washable Blade", value: "Yes (dry brush)" },
          { label: "Weight", value: "160 g" },
        ],
      },
    ],
    whyBuy: [
      {
        icon: "Scissors",
        headline: "Sharp blades that stay sharp.",
        body: "Hardened stainless steel blades maintain their edge through months of daily use without requiring replacement or sharpening.",
      },
      {
        icon: "Zap",
        headline: "60 minutes. No cord.",
        body: "60 minutes of cordless runtime — enough for multiple grooming sessions on a single charge. The cord is only there to charge it.",
      },
      {
        icon: "Lock",
        headline: "Won't turn on in your bag.",
        body: "The travel lock physically prevents accidental activation. Pack it confident it'll arrive exactly as you left it.",
      },
      {
        icon: "Plug",
        headline: "Your phone cable charges it.",
        body: "USB-C means your desk, your car, your power bank — the same cable you already own charges your trimmer too.",
      },
    ],
    useCases: [
      {
        title: "Daily Grooming",
        description: "Clean beard edges, necklines, and touchups every morning.",
        scene: "/scenes/desk-lamp-c.webp",
        purpose: "home",
      },
      {
        title: "Business Travel",
        description: "Travel lock + USB-C = packed in minutes, charged anywhere.",
        scene: "/scenes/headlamp-lifestyle.webp",
        purpose: "travel",
      },
      {
        title: "Family Use",
        description: "One trimmer, four guard sizes, multiple family members.",
        scene: "/scenes/living-room-hero.webp",
        purpose: "home",
      },
      {
        title: "Professional Looks",
        description: "Maintain sharp presentation between salon visits.",
        scene: "/scenes/desk-lamp-c.webp",
        purpose: "office",
      },
    ],
    faqs: [
      {
        question: "Can I use it for body hair?",
        answer:
          "Yes. The 40 mm blade width and included guards (1–5 mm) work for beard, mustache, body, and hairline trimming.",
      },
      {
        question: "How do I clean the blade?",
        answer:
          "Press the release tab to remove the blade head, then brush off hair using the included cleaning brush. The blade can be rinsed under water — dry thoroughly before reattaching.",
      },
      {
        question: "What is the travel lock?",
        answer:
          "A sliding switch on the body prevents the power button from activating. No accidental pressure can turn the device on — useful for bags and luggage.",
      },
      {
        question: "How long does the charge last?",
        answer:
          "60 minutes of continuous runtime from a 1.5-hour charge. For most users, that's 5–7 complete grooming sessions per charge.",
      },
    ],
  },

  {
    productId: "p-industrial-torch",
    tagline: "Professional-grade. No excuses.",
    editorial:
      "The Industrial Beam Torch is built for professionals who can't afford equipment failure. High-output beam for long-distance inspection, an impact-resistant body for rough handling, and a textured grip that holds through gloves, sweat, and tight spaces.",
    warranty: "1 year",
    delivery: "2–5 days across Pakistan",
    gallery: [
      "/products/industrial.webp",
      "/scenes/building-night.webp",
      "/scenes/headlamp-lifestyle.webp",
    ],
    specGroups: [
      {
        title: "Light Output",
        items: [
          { label: "Lumens", value: "800 lm" },
          { label: "Beam Distance", value: "500 m" },
          { label: "Beam Type", value: "Focused spot with spill" },
          { label: "Modes", value: "High / Medium / Low / Strobe / SOS" },
        ],
      },
      {
        title: "Power",
        items: [
          { label: "Battery", value: "18650 Li-ion (included)" },
          { label: "Charging", value: "USB-C side port" },
          { label: "Charge Time", value: "4–5 hours" },
          { label: "Runtime (High)", value: "3 hours" },
          { label: "Runtime (Low)", value: "12+ hours" },
        ],
      },
      {
        title: "Durability",
        items: [
          { label: "Body", value: "Military-grade aluminium" },
          { label: "Water Resistance", value: "IP65 (jet-resistant)" },
          { label: "Impact Rating", value: "1.5 m drop-tested" },
          { label: "Grip", value: "Knurled aluminium" },
          { label: "Belt Clip", value: "Heavy-duty stainless" },
          { label: "Weight", value: "280 g" },
        ],
      },
    ],
    whyBuy: [
      {
        icon: "Zap",
        headline: "800 lumens. 500 metres.",
        body: "A focused spot beam that reaches 500 m — essential for industrial inspection, security patrols, and long-distance signaling.",
      },
      {
        icon: "Shield",
        headline: "IP65. 1.5 m drop-tested.",
        body: "Jet-water resistance and impact certification means it handles the roughest job-site conditions without failing.",
      },
      {
        icon: "Wrench",
        headline: "Built for gloved hands.",
        body: "Deep knurled grip on the aluminium body provides secure hold through work gloves, in wet conditions, and with cold hands.",
      },
      {
        icon: "Package",
        headline: "Clip it. Carry it. Forget it.",
        body: "The heavy-duty belt clip secures the torch to any belt or pocket — immediate access without occupying your hands.",
      },
    ],
    useCases: [
      {
        title: "Industrial Inspection",
        description: "500 m beam for warehouse, facility, and equipment inspection.",
        scene: "/scenes/building-night.webp",
        purpose: "industrial",
      },
      {
        title: "Construction Sites",
        description: "IP65 rating handles concrete dust, rain, and mud on-site.",
        scene: "/scenes/building-night.webp",
        purpose: "construction",
      },
      {
        title: "Search Operations",
        description: "800 lumens and SOS mode for emergency signaling and search.",
        scene: "/scenes/emergency-strip.webp",
        purpose: "emergency",
      },
      {
        title: "Night Security",
        description: "Extended low-mode runtime for all-night security patrol shifts.",
        scene: "/scenes/headlamp-lifestyle.webp",
        purpose: "travel",
      },
    ],
    faqs: [
      {
        question: "Can I use standard AA batteries?",
        answer:
          "No. This torch runs exclusively on the included 18650 Li-ion cell. The USB-C charging port is built into the torch body — no adapter required.",
      },
      {
        question: "What does IP65 mean exactly?",
        answer:
          "IP65 means fully dust-proof (zero ingress) and protected against water jets from any direction. Will survive being hosed down — not submersion.",
      },
      {
        question: "Is the belt clip removable?",
        answer:
          "Yes. The clip is attached with two screws and can be removed if you prefer a clean profile without it.",
      },
      {
        question: "How does it compare to the Multi-Function Torch?",
        answer:
          "Higher output (800 vs 450 lm), longer range (500 m vs 305 m), superior water resistance (IP65 vs IP64), and 1-year warranty vs 6-month. Built for professional and heavy-duty use.",
      },
    ],
  },
];

const detailMap: Record<string, ProductDetail> = Object.fromEntries(
  details.map((d) => [d.productId, d]),
);

export function getProductDetail(productId: string): ProductDetail | null {
  return detailMap[productId] ?? null;
}
