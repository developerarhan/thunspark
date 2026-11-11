import React from 'react';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { Section01Hero } from '@/components/sections/Section01Hero';
import { Section02Problems } from '@/components/sections/Section02Problems';
import { Section03PositioningStrip } from '@/components/sections/Section03PositioningStrip';
import { Section04SolutionsSelector } from '@/components/sections/Section04SolutionsSelector';
import { Section05ProcessPathway } from '@/components/sections/Section05ProcessPathway';
import { Section06Industries } from '@/components/sections/Section06Industries';
import { Section07FeaturedWork } from '@/components/sections/Section07FeaturedWork';
import { Section08ClientLove } from '@/components/sections/Section08ClientLove';
import { Section09WhyThunSpark } from '@/components/sections/Section09WhyThunSpark';
import { Section10Insights } from '@/components/sections/Section10Insights';
import { Section11FAQ } from '@/components/sections/Section11FAQ';
import { Section12FinalCTA } from '@/components/sections/Section12FinalCTA';

export const metadata: Metadata = buildMetadata({
  title: { absolute: 'Digital Marketing Agency in India · ThunSpark' },
  description:
    'Strategy-led digital growth: social media, paid ads, SEO, content & web. We solve business problems, not just post content.',
  ogTitle: 'Digital Marketing Agency in India · ThunSpark',
  ogDescription:
    'Strategy That Sparks Growth. Connected digital growth across strategy, creative, search, and conversion.',
  path: '/',
});

export default function HomePage() {
  return (
    <>
      {/* §1 Hero with Rotating Breakthroughs Slot & Floating Chips */}
      <Section01Hero />

      {/* §2 Problems Grid (6 Real Business Bottlenecks) */}
      <Section02Problems />

      {/* §3 Positioning Strip (Diagnose -> Build -> Prove) */}
      <Section03PositioningStrip />

      {/* §4 Solutions Selector (4 Groups: Attract, Engage, Convert, Optimize) */}
      <Section04SolutionsSelector />

      {/* §5 Process Pathway (5 Nodes: Diagnose to Measure) */}
      <Section05ProcessPathway />

      {/* §6 Industries (Startups, E-com, B2B, Lean Teams) */}
      <Section06Industries />

      {/* §7 Selected Work (4 Confirmed Scope & Overview Showcases) */}
      <Section07FeaturedWork />

      {/* §8 Client Love / Client Voices (Anti-Fabrication Transparency Grid) */}
      <Section08ClientLove />

      {/* §9 Why ThunSpark (Problem-first, Full-funnel, Senior-led, Transparency) */}
      <Section09WhyThunSpark />

      {/* §10 Insights (Auto-hidden when 0 published posts) */}
      <Section10Insights posts={[]} />

      {/* §11 FAQ (Single-Open Accordion with FAQPage JSON-LD) */}
      <Section11FAQ />

      {/* §12 Final CTA with Approved Radial Glow & Deliverables */}
      <Section12FinalCTA />
    </>
  );
}
