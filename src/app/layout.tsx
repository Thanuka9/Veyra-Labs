import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { VeyraWidgetDock } from "@/components/VeyraWidgetDock";
import { SiteBackground } from "@/components/SiteBackground";

import { ScrollToTop } from "@/components/ScrollToTop";
import { CONTACT_EMAIL } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Veyra Labs  -  Software & AI Engineering Studio",
    template: "%s | Veyra Labs",
  },
  description:
    "Veyra Labs architects enterprise SaaS, AI systems, e-commerce and premium websites. 90%+ predictive accuracy, 40% audit overhead reduction, 15+ projects shipped. Contact us for a free project quote.",
  keywords: [
    "software development agency",
    "SaaS development",
    "AI implementation",
    "AI architect",
    "web development studio",
    "e-commerce development",
    "predictive analytics",
    "enterprise LMS",
    "Veyra Labs",
    "Colombo Sri Lanka",
  ],
  authors: [{ name: "Veyra Labs", url: siteUrl }],
  creator: "Veyra Labs",
  alternates: {
    canonical: siteUrl,
  },
  ...(googleVerification
    ? { verification: { google: googleVerification } }
    : {}),
  icons: {
    icon: "/brand/app-icon.png",
    apple: "/brand/app-icon.png",
  },
  openGraph: {
    title: "Veyra Labs  -  Software & AI Engineering Studio",
    description:
      "We design, engineer and ship intelligent products  -  SaaS, AI, e-commerce and premium websites with proven enterprise outcomes.",
    url: siteUrl,
    siteName: "Veyra Labs",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Veyra Labs  -  Software & AI Engineering Studio",
    description:
      "Enterprise SaaS, AI systems, e-commerce & premium websites  -  battle-tested in production.",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Veyra Labs",
  url: siteUrl,
  logo: `${siteUrl}/brand/app-icon.png`,
  image: `${siteUrl}/opengraph-image`,
  description:
    "Boutique software and AI engineering studio building SaaS platforms, AI systems, e-commerce and premium websites.",
  email: CONTACT_EMAIL,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Colombo",
    addressCountry: "LK",
  },
  knowsAbout: [
    "SaaS Development",
    "Artificial Intelligence",
    "E-Commerce",
    "Predictive Analytics",
    "Full Stack Engineering",
    "Enterprise LMS",
  ],
  priceRange: "$500 - $25,000+",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Veyra Labs",
  url: siteUrl,
  description: metadata.description as string,
  publisher: { "@type": "Organization", name: "Veyra Labs" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">

        <SiteBackground />
        <div id="app-shell" className="flex min-h-full flex-1 flex-col">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-violet focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>
          {children}
        </div>
        <VeyraWidgetDock />
        <ScrollToTop />
      </body>
    </html>
  );
}
