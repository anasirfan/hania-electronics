import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { AppProviders } from "@/components/providers/app-providers";
import { SplashScreen } from "@/components/atmosphere/splash-screen";
import { FloatingLights } from "@/components/atmosphere/floating-lights";
import { Spotlight } from "@/components/atmosphere/spotlight";
import { Noise } from "@/components/atmosphere/noise";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
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
    "Premium lighting solutions for every Pakistani home — emergency lights, solar lights, professional torches, and more. Wholesale & retail with Pakistan-wide delivery.",
  keywords: [
    "Hania Electronics",
    "emergency lights Pakistan",
    "solar lights Karachi",
    "torch lights wholesale",
    "head lamps",
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
        {/* Runs synchronously before React hydration — blocks flash of home content */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(!sessionStorage.getItem('hania-splash-seen'))document.documentElement.dataset.splash='1'}catch(e){}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AppProviders>
          <NextTopLoader
            color="#22d3ee"
            height={3}
            showSpinner={false}
            shadow="0 0 10px #22d3ee, 0 0 5px #22d3ee"
          />
          <SplashScreen />
          <FloatingLights />
          <Spotlight />
          <Noise />
          <Header />
          <main className="relative z-[3]">{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
