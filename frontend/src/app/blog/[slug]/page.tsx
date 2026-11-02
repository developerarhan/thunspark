import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Tag } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Clock, ArrowRight } from 'lucide-react';
import Script from 'next/script';

interface ArticleDetailPageProps {
  params: Promise<{ slug: string }>;
}

// Stub/Sanity query function for dynamic article fetching
async function getArticle(_slug: string) {
  // If Sanity client query is added, it will fetch here.
  // Until articles are published in Sanity, return null to show standard 404
  return null;
}

export async function generateMetadata({ params }: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: 'Article Not Found | ThunSpark' };

  return {
    title: `${(article as any).title} | ThunSpark`,
    description: (article as any).excerpt,
  };
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { slug } = await params;
  const article = (await getArticle(slug)) as any;

  if (!article) {
    notFound();
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.published_at,
    author: {
      '@type': 'Organization',
      name: 'ThunSpark',
      url: 'https://thunspark.agency',
    },
  };

  return (
    <>
      <Script
        id={`article-schema-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="flex flex-col">
        <section className="pt-28 pb-16 md:pt-36 md:pb-24 border-b border-[#252525]">
          <Container>
            <div className="max-w-3xl mx-auto">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#8A8A85] hover:text-[#FFD21F] transition-colors mb-6"
              >
                <ArrowLeft size={14} />
                <span>All Insights</span>
              </Link>

              <div className="flex items-center gap-3 mb-4">
                <Tag variant="accent">{article.category?.name || 'Growth Strategy'}</Tag>
                {article.reading_time && (
                  <span className="flex items-center gap-1 text-xs font-mono text-[#8A8A85]">
                    <Clock size={12} />
                    <span>{article.reading_time} min read</span>
                  </span>
                )}
              </div>

              <h1 className="font-display font-medium text-3xl sm:text-4xl lg:text-5xl text-[#F5F5F0] tracking-tight mb-6">
                {article.title}
              </h1>

              <p className="text-[#8A8A85] text-base sm:text-lg leading-relaxed mb-8">
                {article.excerpt}
              </p>
            </div>
          </Container>
        </section>

        {/* Article Content & CTA */}
        <section className="py-16 md:py-24">
          <Container>
            <div className="max-w-3xl mx-auto space-y-12">
              <div className="prose prose-invert max-w-none text-[#F5F5F0] leading-relaxed">
                {article.content}
              </div>

              {/* Inline Conversion CTA */}
              <Card className="p-8 md:p-10 bg-[#111111] border-[#252525] relative overflow-hidden">
                <span className="font-mono text-xs uppercase tracking-widest text-[#FFD21F] block mb-2">
                  APPLY THIS TO YOUR BUSINESS
                </span>
                <h3 className="font-display font-medium text-2xl text-[#F5F5F0] mb-3">
                  Ready to diagnose your growth bottleneck?
                </h3>
                <p className="text-[#8A8A85] text-sm leading-relaxed mb-6">
                  Book a 30-minute strategy call with our senior growth strategists. We will review your acquisition funnel and tell you what we would fix first.
                </p>
                <Button href="/contact" variant="primary" size="md">
                  <span>Book a strategy call</span>
                  <ArrowRight size={14} />
                </Button>
              </Card>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
}
