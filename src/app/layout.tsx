import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { site } from "@/lib/site";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

// Brand theme.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

// Yard theme: an industrial grotesque with the width to carry heavy display
// sizes, paired with a mono for stencil-style labels.
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

const title = `${site.name} — ${site.slogan}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description: site.description,
  applicationName: site.name,
  openGraph: {
    title,
    description: site.description,
    siteName: site.name,
    images: [{ url: "/logo.jpg", width: 640, height: 640, alt: site.name }],
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#051839",
};

/**
 * Applies the stored design choice before first paint.
 *
 * Without this the page renders in the default theme and then snaps to the
 * chosen one on hydration, which is a visible flash on every navigation.
 */
const APPLY_DESIGN = `(function(){try{var d=localStorage.getItem("castleclean-design");document.documentElement.dataset.design=d==="yard"?"yard":"brand"}catch(e){document.documentElement.dataset.design="brand"}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-design="brand" className="scroll-smooth">
      <head>
        <script dangerouslySetInnerHTML={{ __html: APPLY_DESIGN }} />
      </head>
      <body
        className={`${inter.variable} ${archivo.variable} ${plexMono.variable} antialiased`}
      >
        {children}
        {/* Cookieless, so no consent banner needed. No-ops off Vercel. */}
        <Analytics />
      </body>
    </html>
  );
}
