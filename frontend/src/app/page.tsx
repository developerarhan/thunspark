import React from 'react';
import { Section01Hero } from '@/components/sections/Section01Hero';
import { Section02Problems } from '@/components/sections/Section02Problems';
import { Section03PositioningStrip } from '@/components/sections/Section03PositioningStrip';
import { Section04SolutionsSelector } from '@/components/sections/Section04SolutionsSelector';
import { Section05ProcessPathway } from '@/components/sections/Section05ProcessPathway';
import { Section06Industries } from '@/components/sections/Section06Industries';
import { Section07FeaturedWork } from '@/components/sections/Section07FeaturedWork';
import { Section08ClientLove } from '@/components/sections/Section08ClientLove';
import { Section08WhyThunSpark } from '@/components/sections/Section08WhyThunSpark';
import { Section09Insights } from '@/components/sections/Section09Insights';
import { Section10FAQ } from '@/components/sections/Section10FAQ';
import { Section11FinalCTA } from '@/components/sections/Section11FinalCTA';

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
      <Section08WhyThunSpark />

      {/* §10 Insights (Auto-hidden when 0 published posts) */}
      <Section09Insights posts={[]} />

      {/* §11 FAQ (Single-Open Accordion with FAQPage JSON-LD) */}
      <Section10FAQ />

      {/* §12 Final CTA with Approved Radial Glow & Deliverables */}
      <Section11FinalCTA />
    </>
  );
}
