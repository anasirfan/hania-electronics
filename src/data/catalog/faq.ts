export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    id: "f1",
    question: "Do you deliver all over Pakistan?",
    answer:
      "Yes. We deliver nationwide from our Karachi warehouse with tracking support for every order.",
  },
  {
    id: "f2",
    question: "Can I order on WhatsApp?",
    answer:
      "Absolutely. Tap Order on WhatsApp on any product — our team confirms stock, pricing, and delivery in minutes.",
  },
  {
    id: "f3",
    question: "Do you offer wholesale / dealer rates?",
    answer:
      "Yes. Apply via Become a Dealer. We support retailers and distributors across Pakistan with dedicated pricing.",
  },
  {
    id: "f4",
    question: "Are products covered by warranty?",
    answer:
      "Select lines include official warranty. Warranty terms are confirmed at purchase for each SKU.",
  },
  {
    id: "f5",
    question: "How do I track my order?",
    answer:
      "Use Track Order in the header with your order ID, or message us on WhatsApp for live status.",
  },
];
