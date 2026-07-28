export const BRAND = {
  name: "HANIA ELECTRONICS",
  shortName: "HANIA",
  tagline: "Illuminate the Night Together",
  headline: "Lighting That Powers Every Moment.",
  supportLine:
    "Emergency lights. Solar. Professional torches. Built for every home in Pakistan.",
  facebook: "https://www.facebook.com/memonbrand",
  address:
    "Shop # S78, 3rd Floor M-3, Falak Corporate City, Talpur Road, Boulton Market, Karachi",
  phones: {
    whatsapp: "03700388720",
    whatsappE164: "923700388720",
    primary: "03332326490",
    primaryDisplay: "0333-2326490",
    secondary: "03312590323",
    secondaryDisplay: "0331-2590323",
    landline: "02132442421",
    landlineDisplay: "0213-2442421",
  },
  contacts: [
    { name: "Fahim Jangda", phone: "0333-2326490", tel: "03332326490" },
    { name: "Hassan Memon", phone: "0331-2590323", tel: "03312590323" },
  ],
} as const;

export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${BRAND.phones.whatsappE164}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function telUrl(phone: string): string {
  return `tel:${phone.replace(/\D/g, "")}`;
}

export function productWhatsAppMessage(name: string, pricePkr: number): string {
  return `Assalam o Alaikum! I want to order:\n\n*${name}*\nPrice: Rs. ${pricePkr.toLocaleString("en-PK")}\n\nFrom HANIA ELECTRONICS website.`;
}
