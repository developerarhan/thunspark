import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container, Section } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { apiClient } from '@/lib/api-client';
import { ArrowLeft, Clock, Calendar, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ArticleDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function getArticle(slug: string) {
  try {
    const res = await apiClient.GET('/api/blog/articles/{slug}/', {
      params: { path: { slug } },
      next: { tags: [`article-${slug}`, 'articles'] },
    });
    return res?.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: 'Article Not Found' };

  return {
    title: article.meta_title || article.title,
    description: article.meta_description || article.excerpt,
    openGraph: {
      title: article.og_title || article.title,
      description: article.og_description || article.excerpt,
      type: 'article',
      publishedTime: article.published_at || undefined,
    },
  };
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { slug } = await params;
  const article = (await getArticle(slug)) as any;

  if (!article) {
    notFound();
  }

  // Generate Article Schema Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.published_at,
    author: {
      '@type': 'Person',
      name: article.author?.name || 'Thunspark Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Thunspark',
      url: 'https://www.thunspark.agency',
    },
  };

  return (
    <article className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section className="pt-20 pb-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-accent transition-colors mb-8"
            >
              <ArrowLeft size={14} />
              <span>Back to Insights</span>
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <Badge variant="accent">
                {article.category?.name || 'Growth Strategy'}
              </Badge>
              <span className="flex items-center gap-1 text-xs font-mono text-text-muted">
                <Clock size={12} />
                <span>{article.reading_time || 4} min read</span>
              </span>
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-text-primary leading-[1.15] mb-6">
              {article.title}
            </h1>

            <p className="text-text-secondary text-base sm:text-lg leading-relaxed mb-8">
              {article.excerpt}
            </p>

            {/* Author Meta */}
            <div className="flex items-center gap-4 py-4 border-y border-border mb-12">
              <div className="w-10 h-10 rounded-full bg-surface-elevated border border-border flex items-center justify-center text-accent">
                <User size={18} />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-text-primary">
                  {article.author?.name || 'Thunspark Strategy Team'}
                </h4>
                <p className="text-xs text-text-muted">
                  {article.author?.role || 'Growth Strategist'}
                </p>
              </div>
            </div>

            {article.featured_image && (
              <div className="rounded-2xl overflow-hidden border border-border bg-surface-elevated aspect-[16/9] mb-12">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.featured_image}
                  alt={article.featured_image_alt || article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Rich Article Body */}
            <div
              className="prose prose-invert max-w-none text-text-secondary text-base leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Bottom In-Content CTA */}
            <div className="mt-16 pt-12 border-t border-border">
              <Card className="p-8 sm:p-10 border-accent/40 bg-surface-elevated text-center">
                <Badge variant="accent" className="mb-3">
                  Solve The Problem
                </Badge>
                <h3 className="font-display font-bold text-2xl text-text-primary mb-3">
                  Ready to Apply This Strategy to Your Business?
                </h3>
                <p className="text-text-secondary text-xs sm:text-sm max-w-lg mx-auto mb-6">
                  We audit commercial bottlenecks and engineer tailored acquisition and conversion systems.
                </p>
                <Button href="/contact" size="md" variant="primary">
                  <span>Start a Conversation</span>
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </article>
  );
}
