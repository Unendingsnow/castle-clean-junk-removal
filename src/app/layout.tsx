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

const title = `${site.name} — Junk Removal & Cleanouts in Wilmington`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description: site.subhead,
  applicationName: site.name,
  openGraph: {
    title,
    description: site.subhead,
    siteName: site.name,
    images: [{ url: "/logo.jpg", width: 640, height: 640, alt: site.name }],
    type: "website",
  },
  robots: { index: true, follow: true },
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
      <body
        className={`${archivo.variable} ${plexMono.variable} antialiased`}
      >
        {children}
        {/* Cookieless, so no consent banner needed. No-ops off Vercel. */}
        <Analytics />
      </body>
    </html>
  );
}
