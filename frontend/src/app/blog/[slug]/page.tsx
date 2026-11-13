import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { Container } from '@/components/ui/Container';
import { Tag } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { BookingButton } from '@/components/ui/BookingButton';
import { BlogReadTracker } from '@/components/blog/BlogReadTracker';
import { ArrowLeft, Clock, ArrowRight } from 'lucide-react';
import { getAllPosts, getPostBySlug } from '@/lib/sanity/fetchers';
import { urlForImage } from '@/lib/sanity/image';
import {
  buildAbsoluteUrl,
  buildBreadcrumbSchema,
  buildMetadata,
  ORGANIZATION_SCHEMA_REF,
  serializeJsonLd,
} from '@/lib/seo';

interface ArticleDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPostBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found',
      robots: { index: false, follow: false },
    };
  }

  const ogImageUrl = article.coverImage
    ? urlForImage(article.coverImage)?.width(1200).height(630).url() ?? undefined
    : undefined;

  return buildMetadata({
    title: { absolute: `${article.title} | ThunSpark` },
    description: article.excerpt,
    path: `/blog/${slug}`,
    type: 'article',
    image: ogImageUrl,
  });
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { slug } = await params;
  const article = await getPostBySlug(slug);

  if (!article) {
    notFound();
  }

  const canonicalUrl = buildAbsoluteUrl(`/blog/${slug}`);
  const coverImageUrl = article.coverImage
    ? urlForImage(article.coverImage)?.width(1200).height(675).url() ?? undefined
    : undefined;

  const authorSchema = article.author?.name
    ? {
        '@type': 'Person',
        name: article.author.name,
        ...(article.author.role ? { jobTitle: article.author.role } : {}),
      }
    : ORGANIZATION_SCHEMA_REF;

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    url: canonicalUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    ...(article.publishedAt ? { datePublished: article.publishedAt } : {}),
    ...(coverImageUrl ? { image: [coverImageUrl] } : {}),
    author: authorSchema,
    publisher: ORGANIZATION_SCHEMA_REF,
  };

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: article.title, path: `/blog/${slug}` },
  ]);

  return (
    <>
      <script
        id={`article-schema-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(blogPostingSchema) }}
      />
      <script
        id={`article-breadcrumb-schema-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }}
      />
      <BlogReadTracker slug={slug} />
      <div className="flex flex-col">
        <section className="pt-28 pb-16 md:pt-36 md:pb-24 border-b border-line">
          <Container>
            <div className="max-w-3xl mx-auto">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-meta hover:text-accent transition-colors mb-6"
              >
                <ArrowLeft size={14} />
                <span>All Insights</span>
              </Link>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Tag variant="accent">{article.category?.title || 'Growth Strategy'}</Tag>
                {article.readingTime && (
                  <span className="flex items-center gap-1 text-xs font-mono text-meta">
                    <Clock size={12} />
                    <span>{article.readingTime} min read</span>
                  </span>
                )}
                {article.publishedAt && (
                  <time
                    dateTime={article.publishedAt}
                    className="text-xs font-mono text-meta"
                  >
                    {new Date(article.publishedAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                )}
              </div>

              <h1 className="font-display font-medium text-3xl sm:text-4xl lg:text-5xl text-ink tracking-tight mb-6">
                {article.title}
              </h1>

              <p className="text-soft text-base sm:text-lg leading-relaxed mb-6">
                {article.excerpt}
              </p>

              {article.author?.name && (
                <div className="text-xs font-mono text-meta">
                  By <span className="text-ink">{article.author.name}</span>
                  {article.author.role ? ` · ${article.author.role}` : ''}
                </div>
              )}
            </div>
          </Container>
        </section>

        {/* Article Content & CTA */}
        <section className="py-16 md:py-24">
          <Container>
            <div className="max-w-3xl mx-auto space-y-12">
              {article.body && article.body.length > 0 && (
                <div className="prose prose-invert max-w-none text-soft leading-relaxed space-y-6">
                  <PortableText value={article.body} />
                </div>
              )}

              {/* Inline Conversion CTA */}
              <Card className="p-8 md:p-10 bg-card border-line relative overflow-hidden">
                <span className="font-mono text-xs uppercase tracking-widest text-accent block mb-2">
                  APPLY THIS TO YOUR BUSINESS
                </span>
                <h3 className="font-display font-medium text-2xl text-ink mb-3">
                  Ready to diagnose your growth bottleneck?
                </h3>
                <p className="text-soft text-sm leading-relaxed mb-6">
                  Book a 30-minute strategy call with our senior growth strategists. We will review your acquisition funnel and tell you what we would fix first.
                </p>
                <BookingButton location="blog_post_cta" variant="primary" size="md">
                  <span>Book a strategy call</span>
                  <ArrowRight size={14} />
                </BookingButton>
              </Card>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
}
