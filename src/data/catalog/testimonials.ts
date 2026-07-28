export interface Testimonial {
  id: string;
  name: string;
  city: string;
  role: string;
  quote: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Ahmed Raza",
    city: "Karachi",
    role: "Homeowner",
    quote:
      "The emergency lights kept our entire floor lit during a long load-shedding night. Build quality feels genuinely premium.",
  },
  {
    id: "t2",
    name: "Sana Malik",
    city: "Lahore",
    role: "Retail Partner",
    quote:
      "As a dealer, margins are fair and customers come back for the torches. Packaging and support are a cut above.",
  },
  {
    id: "t3",
    name: "Bilal Hussain",
    city: "Islamabad",
    role: "Site Supervisor",
    quote:
      "We outfit crews with Hania headlamps. Battery life holds up on long shifts — no cheap flicker.",
  },
  {
    id: "t4",
    name: "Fatima Noor",
    city: "Multan",
    role: "Camping Enthusiast",
    quote:
      "Solar lanterns look and feel international. Warm light, solid handle, zero catalogue vibes.",
  },
];
