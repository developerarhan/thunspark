import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AttributionTracker } from "@/components/analytics/AttributionTracker";
import { CookieConsentBanner } from "@/components/analytics/CookieConsentBanner";
import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { RouteTracker } from "@/components/analytics/RouteTracker";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Thunspark — Strategic Digital Growth & Marketing Agency",
    template: "%s | Thunspark",
  },
  description:
    "We help ambitious businesses turn strategy, content, search, websites, and digital channels into a connected system designed to attract, convert, and grow customers.",
  metadataBase: new URL("https://www.thunspark.agency"),
  keywords: [
    "Digital Marketing Agency",
    "Growth Strategy",
    "SEO",
    "Conversion Rate Optimization",
    "B2B Growth",
    "Headless Web Development",
  ],
  authors: [{ name: "Thunspark Agency", url: "https://www.thunspark.agency" }],
  creator: "Thunspark",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.thunspark.agency",
    siteName: "Thunspark",
    title: "Thunspark — Strategic Digital Growth Agency",
    description:
      "Digital Marketing Built Around Your Growth. A connected system of strategy, content, search, and conversion.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thunspark — Strategic Digital Growth Agency",
    description:
      "Digital Marketing Built Around Your Growth. We start with the business problem, not a sales pitch.",
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
      "@id": "https://www.thunspark.agency/#organization",
      "name": "Thunspark",
      "url": "https://www.thunspark.agency",
      "logo": "https://www.thunspark.agency/images/logo.png",
      "description":
        "Global digital marketing and digital growth agency building connected systems of strategy, content, search, websites, and conversion.",
      "sameAs": [
        "https://linkedin.com/company/thunspark",
        "https://twitter.com/thunspark",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://www.thunspark.agency/#website",
      "url": "https://www.thunspark.agency",
      "name": "Thunspark",
      "publisher": {
        "@id": "https://www.thunspark.agency/#organization",
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
      className={`${inter.variable} ${jakarta.variable} dark antialiased scroll-smooth`}
    >
      <head>
        {/* Google Consent Mode v2 Default Settings (Must execute before any tags) */}
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
        {/* Organization & WebSite Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-bg-primary text-text-primary selection:bg-accent-soft selection:text-text-primary">
        {gtmId && <GoogleTagManager gtmId={gtmId} />}
        <Suspense fallback={null}>
          <RouteTracker />
        </Suspense>
        <ScrollDepthTracker />
        <CookieConsentBanner />
        <AttributionTracker />
        <Header />
        <main className="flex-1 pt-24">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

