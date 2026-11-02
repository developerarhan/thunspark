import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';
import { BlogListingView } from '@/components/blog/BlogListingView';

export const metadata: Metadata = {
  title: 'Strategic Growth Insights & Playbooks | ThunSpark',
  description:
    'Deep dives on customer acquisition economics, search intent, conversion rate optimization, and connected digital growth systems.',
  openGraph: {
    title: 'Growth Insights & Playbooks | ThunSpark',
    description:
      'Practical breakdowns on turning traffic into enterprise pipeline, fixing conversion friction, and scaling unit economics.',
    url: 'https://thunspark.agency/blog',
  },
  alternates: {
    canonical: '/blog',
  },
};

export default async function BlogPage() {
  // Graceful CMS fallback (empty array until posts are created in Sanity)
  const articles: any[] = [];
  const categories: any[] = [];

  return (
    <div className="flex flex-col">
      {/* 1. HERO */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 border-b border-[#252525]">
        <Container>
          <Reveal>
            <div className="max-w-3xl">
              <span className="font-mono text-xs uppercase tracking-widest text-[#FFD21F] block mb-3">
                STRATEGY & PLAYBOOKS
              </span>
              <h1 className="font-display font-medium text-4xl sm:text-5xl lg:text-6xl text-[#F5F5F0] tracking-tight mb-6">
                Growth insights. <br />
                <span className="text-[#8A8A85]">Zero fluff.</span>
              </h1>
              <p className="text-[#8A8A85] text-base sm:text-lg leading-relaxed">
                Practical breakdowns on turning search and paid traffic into predictable enterprise revenue, eliminating conversion leaks, and managing capital efficiency.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 2. BLOG LISTING VIEW */}
      <section className="py-20 md:py-28 border-b border-[#252525]">
        <Container>
          <BlogListingView initialArticles={articles} categories={categories} />
        </Container>
      </section>
    </div>
  );
}
