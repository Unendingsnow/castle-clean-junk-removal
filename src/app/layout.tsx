import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { site } from "@/lib/site";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

// An industrial grotesque with the width to carry heavy display sizes, paired
// with a mono for the stencil-style labels.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "800"],
});
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

/**
 * Keyword-led rather than brand-led, and kept under ~60 characters so Google
 * doesn't truncate it in results. Nobody searches "Castle Clean" yet; they
 * search "junk removal wilmington nc".
 */
// Leland leads Wilmington here on purpose. It's where the business is based,
// and it's a far less contested term — Wilmington is where the national
// franchises spend, Leland is winnable. Both fit inside the ~60 characters
// Google renders before truncating.
const title = "Junk Removal in Leland & Wilmington, NC | Castle Clean";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    // Short suffix on purpose: the full business name added 27 characters and
    // pushed every sub-page title past the ~60 Google renders before cutting.
    template: `%s | ${site.shortName}`,
  },
  description: site.metaDescription,
  applicationName: site.name,
  // Vercel serves identical content on preview and www/apex variants; without
  // a canonical those compete with each other for the same terms.
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description: site.metaDescription,
    siteName: site.name,
    url: siteUrl,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.metaDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Search Console ownership. Set GOOGLE_SITE_VERIFICATION once the property
  // is created; the tag is simply omitted until then. Verifying by DNS instead
  // is fine and makes this unnecessary.
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#0d1a2b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${archivo.variable} ${plexMono.variable} antialiased`}>
        {children}
        {/* Cookieless, so no consent banner needed. No-ops off Vercel. */}
        <Analytics />
      </body>
    </html>
  );
}
