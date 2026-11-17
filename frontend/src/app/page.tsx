import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { MAX_HOME_CLIENTS } from '@/lib/content/projects';
import { getProjects, getAllPosts, getTestimonials } from '@/lib/sanity/fetchers';
import { Section01Hero } from '@/components/sections/Section01Hero';
import { Section03PositioningStrip } from '@/components/sections/Section03PositioningStrip';
import { Section02Problems } from '@/components/sections/Section02Problems';
import { Section04SolutionsSelector } from '@/components/sections/Section04SolutionsSelector';
import { Section07FeaturedWork } from '@/components/sections/Section07FeaturedWork';
import { SectionCreativeDriftWall } from '@/components/sections/SectionCreativeDriftWall';
import { Section08ClientLove } from '@/components/sections/Section08ClientLove';
import { Section05ProcessPathway } from '@/components/sections/Section05ProcessPathway';
import { Section06Industries } from '@/components/sections/Section06Industries';
import { Section09WhyThunSpark } from '@/components/sections/Section09WhyThunSpark';
import { Section10Insights } from '@/components/sections/Section10Insights';
import { Section11FAQ } from '@/components/sections/Section11FAQ';
import { Section12FinalCTA } from '@/components/sections/Section12FinalCTA';

export const revalidate = 60;

export const metadata: Metadata = buildMetadata({
  title: 'ThunSpark | Digital Growth Agency — Strategy, Execution & Measurement',
  description:
    'We diagnose what’s blocking your growth, then connect strategy, execution, and measurement into one system — so every move has a reason and every result is provable.',
  path: '/',
});

export default async function HomePage() {
  const [projects, sanityPosts, testimonials] = await Promise.all([
    getProjects(),
    getAllPosts(),
    getTestimonials(),
  ]);
  const visibleProjects = projects.slice(0, MAX_HOME_CLIENTS);

  const homeInsights = sanityPosts
    .filter((p) => Boolean(p.title && p.slug))
    .slice(0, 3)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      category: p.category?.title || 'Growth Strategy',
      summary: p.excerpt || '',
      date: p.publishedAt
        ? new Date(p.publishedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : 'Recent',
      readTime: `${p.readingTime || 4} min read`,
    }));

  return (
    <>
      <Section01Hero />
      <Section03PositioningStrip />
      <Section02Problems />
      <Section04SolutionsSelector />
      <Section07FeaturedWork
        clients={visibleProjects}
        totalCount={projects.length}
      />
      <SectionCreativeDriftWall />
      <Section08ClientLove testimonials={testimonials} />
      <Section05ProcessPathway />
      <Section06Industries />
      <Section09WhyThunSpark />
      <Section10Insights posts={homeInsights} />
      <Section11FAQ />
      <Section12FinalCTA />
    </>
  );
}
