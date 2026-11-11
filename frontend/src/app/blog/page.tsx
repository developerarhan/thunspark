import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';
import { BlogListingView, type ArticleItem } from '@/components/blog/BlogListingView';
import { buildMetadata } from '@/lib/seo';
import { getAllPosts } from '@/lib/sanity/fetchers';
import { urlForImage } from '@/lib/sanity/image';

export const metadata: Metadata = buildMetadata({
  title: { absolute: 'Strategic Growth Insights & Playbooks | ThunSpark' },
  description:
    'Deep dives on customer acquisition economics, search intent, conversion rate optimization, and connected digital growth systems.',
  ogTitle: 'Growth Insights & Playbooks | ThunSpark',
  ogDescription:
    'Practical breakdowns on turning traffic into enterprise pipeline, fixing conversion friction, and scaling unit economics.',
  path: '/blog',
});

export default async function BlogPage() {
  const posts = await getAllPosts();

  const articles: ArticleItem[] = posts.map((post) => ({
    id: post._id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    coverImageUrl: post.coverImage
      ? urlForImage(post.coverImage)?.width(800).height(500).url() ?? undefined
      : undefined,
    coverImageAlt: post.coverImage?.alt || post.title,
    category: post.category ? { title: post.category.title, slug: post.category.slug } : null,
    author: post.author ? { name: post.author.name, role: post.author.role } : null,
    readingTime: post.readingTime ?? undefined,
    publishedAt: post.publishedAt ?? undefined,
  }));

  const categoryMap = new Map<string, { name: string; slug: string }>();
  for (const post of posts) {
    if (post.category?.slug && post.category?.title) {
      categoryMap.set(post.category.slug, {
        name: post.category.title,
        slug: post.category.slug,
      });
    }
  }
  const categories = Array.from(categoryMap.values());

  return (
    <div className="flex flex-col">
      {/* 1. HERO */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 border-b border-line">
        <Container>
          <Reveal>
            <div className="max-w-3xl">
              <span className="font-mono text-xs uppercase tracking-widest text-accent block mb-3">
                STRATEGY &amp; PLAYBOOKS
              </span>
              <h1 className="font-display font-medium text-4xl sm:text-5xl lg:text-6xl text-ink tracking-tight mb-6">
                Growth insights. <br />
                <span className="text-meta">Zero fluff.</span>
              </h1>
              <p className="text-soft text-base sm:text-lg leading-relaxed">
                Practical breakdowns on turning search and paid traffic into predictable enterprise revenue, eliminating conversion leaks, and managing capital efficiency.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 2. BLOG LISTING VIEW */}
      <section className="py-20 md:py-28 border-b border-line">
        <Container>
          <BlogListingView initialArticles={articles} categories={categories} />
        </Container>
      </section>
    </div>
  );
}
