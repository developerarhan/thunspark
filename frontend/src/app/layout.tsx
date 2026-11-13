import type { Metadata } from "next";
import { Suspense } from "react";
import { Space_Grotesk, Inter, Space_Mono, Playfair_Display } from "next/font/google";
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
import { GlobalClickTracker } from "@/components/analytics/GlobalClickTracker";
import { siteConfig } from "@/site.config";
import { SITE_URL, serializeJsonLd } from "@/lib/seo";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "700"],
  preload: true,
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  preload: true,
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  preload: true,
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  style: "italic",
  weight: "600",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Digital Marketing Agency in India · ThunSpark",
    template: "%s · ThunSpark",
  },
  description:
    "Strategy-led digital growth: social media, paid ads, SEO, content & web. We solve business problems, not just post content.",
  metadataBase: new URL(SITE_URL),
  keywords: [
    "Digital Marketing Agency in India",
    "Social Media Marketing Agency",
    "Performance Marketing & Paid Ads",
    "SEO Services in India",
    "Growth Strategy",
    "Conversion Rate Optimization",
  ],
  authors: [{ name: "ThunSpark", url: SITE_URL }],
  creator: "ThunSpark",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
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
      "@id": `${SITE_URL}/#organization`,
      name: siteConfig.name,
      url: SITE_URL,
      logo: `${SITE_URL}/logo.svg`,
      description: siteConfig.description,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: siteConfig.name,
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
    },
  ],
};

const rawGtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim();
const gtmId =
  rawGtmId && /^GTM-[A-Z0-9]+$/.test(rawGtmId) ? rawGtmId : null;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} ${spaceMono.variable} ${playfair.variable} dark antialiased`}
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
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-base text-ink font-sans selection:bg-accent selection:text-canvas">
        {gtmId && <GoogleTagManager gtmId={gtmId} />}
        <Suspense fallback={null}>
          <RouteTracker />
        </Suspense>
        <ScrollDepthTracker />
        <GlobalClickTracker />
        <CookieConsentBanner />
        <AttributionTracker />
        <MotionProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </MotionProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
