import type { SiteSettings } from "@/domain/types";
import { BRAND } from "@/lib/brand";

export function defaultSiteSettings(): SiteSettings {
  return {
    storeName: BRAND.name,
    tagline: BRAND.tagline,
    supportLine: BRAND.supportLine,
    email: "info@haniaelectronics.pk",
    address: BRAND.address,
    facebookUrl: BRAND.facebook,
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Falak+Corporate+City+Talpur+Road+Boulton+Market+Karachi",
    whatsapp: BRAND.phones.whatsapp,
    whatsappE164: BRAND.phones.whatsappE164,
    phonePrimary: BRAND.phones.primary,
    phonePrimaryDisplay: BRAND.phones.primaryDisplay,
    phoneSecondary: BRAND.phones.secondary,
    phoneSecondaryDisplay: BRAND.phones.secondaryDisplay,
    phoneLandline: BRAND.phones.landline,
    phoneLandlineDisplay: BRAND.phones.landlineDisplay,
    contacts: BRAND.contacts.map((c) => ({ ...c })),
    businessHours: [
      { day: "Monday – Thursday", hours: "9:00 AM – 8:00 PM" },
      {
        day: "Friday",
        hours: "9:00 AM – 12:30 PM, 2:30 PM – 8:00 PM",
      },
      { day: "Saturday", hours: "9:00 AM – 8:00 PM" },
      { day: "Sunday", hours: "10:00 AM – 6:00 PM" },
    ],
    updatedAt: new Date().toISOString(),
  };
}

export function whatsappUrlFrom(
  settings: Pick<SiteSettings, "whatsappE164">,
  message?: string,
): string {
  const base = `https://wa.me/${settings.whatsappE164}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
