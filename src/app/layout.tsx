import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { AppProviders } from "@/components/providers/app-providers";
import { StorefrontShell } from "@/components/layout/storefront-shell";
import { BRAND } from "@/lib/brand";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://haniaelectronics.pk"),
  title: {
    default: `${BRAND.name} | Premium Lighting Pakistan`,
    template: `%s | ${BRAND.name}`,
  },
  description:
    "Shop premium emergency lights, solar lights, metal lights, and flash lights. Cash on delivery across Pakistan.",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: [{ url: "/favicon.png" }],
  },
  keywords: [
    "Hania Electronics",
    "emergency lights Pakistan",
    "solar lights Karachi",
    "torch lights wholesale",
    "metal lights",
    "Memon Brand",
  ],
  openGraph: {
    title: `${BRAND.name} | Lighting That Powers Every Moment`,
    description: BRAND.supportLine,
    type: "website",
    locale: "en_PK",
    images: [{ url: "/scenes/bedroom-warm.webp" }],
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND.name,
    description: BRAND.tagline,
    images: ["/scenes/bedroom-warm.webp"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ElectronicsStore",
  name: BRAND.name,
  description: BRAND.tagline,
  url: "https://haniaelectronics.pk",
  telephone: BRAND.phones.primaryDisplay,
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "Shop # S78, 3rd Floor M-3, Falak Corporate City, Talpur Road, Boulton Market",
    addressLocality: "Karachi",
    addressCountry: "PK",
  },
  sameAs: [BRAND.facebook],
  areaServed: "PK",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jakarta.variable} ${outfit.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AppProviders>
          <NextTopLoader
            color="#0B6BCB"
            height={3}
            showSpinner={false}
          />
          <StorefrontShell>{children}</StorefrontShell>
        </AppProviders>
      </body>
    </html>
  );
}
