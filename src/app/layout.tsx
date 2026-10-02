import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { AppProviders } from "@/components/providers/app-providers";
import { StorefrontShell } from "@/components/layout/storefront-shell";
import {
  categoryRepository,
  siteSettingsRepository,
} from "@/server/repositories";
import { catalogSubtitle } from "@/lib/catalog-copy";
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

export async function generateMetadata(): Promise<Metadata> {
  const [settings, categories] = await Promise.all([
    siteSettingsRepository.get(),
    categoryRepository.list(false),
  ]);
  const description = settings.supportLine || catalogSubtitle(categories);
  const title = `${settings.storeName} | ${settings.tagline}`;
  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_APP_URL ?? "https://haniaelectronics.com",
    ),
    title: {
      default: title,
      template: `%s | ${settings.storeName}`,
    },
    description,
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.png", type: "image/png" },
      ],
      apple: [{ url: "/apple-icon.png", type: "image/png" }],
    },
    keywords: [settings.storeName, ...categories.map((c) => c.name)],
    openGraph: {
      title,
      description,
      type: "website",
      locale: "en_PK",
      url: process.env.NEXT_PUBLIC_APP_URL ?? "https://haniaelectronics.com",
    },
    twitter: {
      card: "summary_large_image",
      title: settings.storeName,
      description: settings.tagline,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await siteSettingsRepository.get();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ElectronicsStore",
    name: settings.storeName,
    description: settings.tagline,
    url: process.env.NEXT_PUBLIC_APP_URL ?? "https://haniaelectronics.com",
    telephone: settings.phonePrimaryDisplay,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: "Karachi",
      addressCountry: "PK",
    },
    sameAs: [settings.facebookUrl],
    areaServed: "PK",
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jakarta.variable} ${outfit.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AppProviders>
          <NextTopLoader color="#0B6BCB" height={3} showSpinner={false} />
          <StorefrontShell>{children}</StorefrontShell>
        </AppProviders>
      </body>
    </html>
  );
}
