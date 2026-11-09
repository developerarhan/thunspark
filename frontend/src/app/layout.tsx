import type { Metadata } from "next";
import { Suspense } from "react";
import { Space_Grotesk, Inter, Space_Mono } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { AttributionTracker } from "@/components/analytics/AttributionTracker";
import { CookieConsentBanner } from "@/components/analytics/CookieConsentBanner";
import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { RouteTracker } from "@/components/analytics/RouteTracker";
import { siteConfig } from "@/site.config";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "700"],
  preload: true,
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  preload: true,
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Digital Marketing Agency in India · ThunSpark",
    template: "%s · ThunSpark",
  },
  description:
    "Strategy-led digital growth: social media, paid ads, SEO, content & web. We solve business problems, not just post content.",
  metadataBase: new URL(siteConfig.url),
  keywords: [
    "Digital Marketing Agency in India",
    "Social Media Marketing Agency",
    "Performance Marketing & Paid Ads",
    "SEO Services in India",
    "Growth Strategy",
    "Conversion Rate Optimization",
  ],
  authors: [{ name: "ThunSpark", url: siteConfig.url }],
  creator: "ThunSpark",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "Digital Marketing Agency in India · ThunSpark",
    description:
      "Strategy That Sparks Growth. Connected digital growth across strategy, creative, search, and conversion.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Marketing Agency in India · ThunSpark",
    description:
      "Strategy That Sparks Growth. We solve business problems, not just post content.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/logo.svg`,
      description: siteConfig.description,
      sameAs: [
        siteConfig.contact.socials.linkedin,
        siteConfig.contact.socials.instagram,
        siteConfig.contact.socials.twitter,
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      publisher: {
        "@id": `${siteConfig.url}/#organization`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || "GTM-THUNSPARK";

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} ${spaceMono.variable} dark antialiased scroll-smooth`}
    >
      <head>
        {/* Fast Preloader Session Check: executes synchronously before paint to prevent flash for returning visitors */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (sessionStorage.getItem('thunspark_visited') === 'true' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                  document.documentElement.classList.add('hide-site-loader');
                }
              } catch (e) {}
            `,
          }}
        />
        {/* Google Consent Mode v2 Default Settings */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'wait_for_update': 500
              });
            `,
          }}
        />
        {/* Organization & WebSite JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#050505] text-[#F5F5F0] font-sans selection:bg-[#FFD21F] selection:text-[#050505]">
        {gtmId && <GoogleTagManager gtmId={gtmId} />}
        <Suspense fallback={null}>
          <RouteTracker />
        </Suspense>
        <ScrollDepthTracker />
        <CookieConsentBanner />
        <AttributionTracker />
        <MotionProvider>
          <Header />
          <main className="flex-1 pt-20">{children}</main>
          <Footer />
        </MotionProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
