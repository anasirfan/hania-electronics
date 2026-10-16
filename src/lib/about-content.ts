import type { AboutContent } from "@/domain/types";

export function defaultAboutContent(): AboutContent {
  return {
    metaTitle: "About — HANIA Electronics",
    metaDescription:
      "The Karachi lighting brand trusted by thousands of homes and hundreds of dealers across Pakistan.",
    heroEyebrow: "Our story",
    heroTitle: "Lighting from Karachi\nfor every home.",
    heroBody:
      "Started to solve a problem every Pakistani family knows — what do you do when the grid goes out? We found the answer, and built a brand around it.",
    stats: [
      { value: "9+", label: "Product lines" },
      { value: "15k+", label: "Customers served" },
      { value: "100+", label: "Active dealers" },
      { value: "2–5 days", label: "Delivery across Pakistan" },
    ],
    storyEyebrow: "Who we are",
    storyTitle: "Karachi-rooted.\nPakistan-wide.",
    storyParagraphs: [
      "HANIA Electronics operates from Falak Corporate City in Boulton Market, Karachi — one of the country's largest commercial hubs. From here, we supply both retail customers and wholesale dealers across every major city in Pakistan.",
      "Our range covers emergency lighting, solar solutions, professional torches, headlamps, and everyday accessories. Every product is selected for durability in Pakistani conditions — not for a catalogue spec sheet.",
      "Our model is simple: buy direct, support your customer, stand behind the product. That's it.",
    ],
    timelineEyebrow: "Our journey",
    timelineTitle: "From a single torch\nto Pakistan's lighting partner.",
    timeline: [
      {
        year: "2018",
        title: "First torch, first sale.",
        body: "Started in Boulton Market with a small range of imported torches. Sold the first batch in a week.",
      },
      {
        year: "2019",
        title: "Solar enters the range.",
        body: "Load-shedding was worsening across Pakistan. We added solar lanterns and emergency lights that actually hold up.",
      },
      {
        year: "2021",
        title: "Dealer network begins.",
        body: "Retailers in Lahore and Faisalabad started calling. We built a wholesale programme and started shipping nationwide.",
      },
      {
        year: "2022",
        title: "15,000 customers milestone.",
        body: "Reached 15k orders. Moved to a larger showroom at Falak Corporate City to handle the volume.",
      },
      {
        year: "2024",
        title: "9 categories. One standard.",
        body: "Expanded to 9 product lines including headlamps, COB work lights, and accessories — every product hand-picked.",
      },
    ],
    valuesEyebrow: "Our values",
    valuesTitle: "How we work.",
    values: [
      {
        title: "Quality over catalogue",
        body: "Every product is tested before it joins our range. We drop what doesn't hold up.",
      },
      {
        title: "Honest pricing",
        body: "Retail prices that make sense. Wholesale rates that leave room for your margin.",
      },
      {
        title: "WhatsApp-first service",
        body: "No ticket queues. A real person responds and knows your order.",
      },
      {
        title: "Built for Pakistan",
        body: "Load-shedding, dust, heat, long nights — our lights are chosen for this climate.",
      },
    ],
    reachEyebrow: "Our reach",
    reachTitle: "Pakistan-wide\ndelivery & dealers.",
    reachBody:
      "We ship to every corner of Pakistan in 2–5 working days via trusted courier partners. Our dealer network spans 7+ cities with stock on the ground.",
    network: [
      { city: "Karachi", role: "Headquarters & Showroom", primary: true },
      { city: "Lahore", role: "Dealer distribution hub", primary: false },
      { city: "Faisalabad", role: "Active dealer network", primary: false },
      { city: "Islamabad", role: "Delivery coverage", primary: false },
      { city: "Peshawar", role: "Delivery coverage", primary: false },
      { city: "Quetta", role: "Delivery coverage", primary: false },
      { city: "Multan", role: "Active dealer network", primary: false },
      { city: "Hyderabad", role: "Delivery coverage", primary: false },
    ],
    ctaTitle: "Ready to place an order?",
    ctaBody: "WhatsApp us or browse the full catalog.",
    updatedAt: new Date().toISOString(),
  };
}
