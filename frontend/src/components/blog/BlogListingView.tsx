'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Tag } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { Search, Clock, ArrowRight, BookOpen } from 'lucide-react';

export interface ArticleItem {
  id?: string | number;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl?: string;
  coverImageAlt?: string;
  category?: { title: string; slug: string } | null;
  author?: { name: string; role?: string | null } | null;
  readingTime?: number;
  publishedAt?: string;
}

interface BlogListingViewProps {
  initialArticles: ArticleItem[];
  categories: { id?: string | number; name: string; slug: string }[];
}

export function BlogListingView({ initialArticles = [], categories = [] }: BlogListingViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(6);

  // Fallback categories if CMS has none yet
  const availableCategories =
    categories.length > 0
      ? categories
      : [
          { name: 'Growth Strategy', slug: 'growth-strategy' },
          { name: 'Paid Acquisition', slug: 'paid-acquisition' },
          { name: 'CRO & Web', slug: 'cro-web' },
          { name: 'SEO & Content', slug: 'seo-content' },
        ];

  const filteredArticles = initialArticles.filter((article) => {
    const matchesCategory =
      selectedCategory === 'all' || article.category?.slug === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const visibleArticles = filteredArticles.slice(0, visibleCount);

  return (
    <div className="w-full space-y-12">
      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-line">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-colors ${
              selectedCategory === 'all'
                ? 'bg-accent text-canvas font-bold'
                : 'bg-card text-meta border border-line hover:border-line-strong hover:text-ink'
            }`}
          >
            All Insights
          </button>
          {availableCategories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-colors ${
                selectedCategory === cat.slug
                  ? 'bg-accent text-canvas font-bold'
                  : 'bg-card text-meta border border-line hover:border-line-strong hover:text-ink'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-meta" />
          <input
            type="text"
            placeholder="Search insights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-card border border-line text-xs text-ink placeholder:text-meta focus:outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>

      {/* Articles Grid or Empty State */}
      {filteredArticles.length === 0 ? (
        <Card className="p-12 text-center border-line bg-card max-w-xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-elevated border border-line text-accent flex items-center justify-center mx-auto mb-4">
            <BookOpen size={26} />
          </div>
          <h4 className="font-display font-medium text-2xl text-ink mb-3">
            Writing What&apos;s Next.
          </h4>
          <p className="text-soft text-xs md:text-sm leading-relaxed mb-6">
            We publish deep-dive breakdowns on customer acquisition economics, search intent, and digital conversion systems. Check back soon as our senior team publishes new essays.
          </p>
          <Button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            size="sm"
            variant="secondary"
          >
            Clear Filters
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleArticles.map((article) => (
            <Reveal key={article.slug}>
              <Link href={`/blog/${article.slug}`} className="group block h-full">
                <Card className="h-full flex flex-col justify-between overflow-hidden border-line bg-card hover:border-accent/40 hover:bg-elevated transition-all">
                  <div>
                    {article.coverImageUrl ? (
                      <div className="aspect-[16/10] w-full overflow-hidden bg-elevated relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={article.coverImageUrl}
                          alt={article.coverImageAlt || article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/10] w-full bg-elevated flex items-center justify-center border-b border-line">
                        <BookOpen size={28} className="text-meta" />
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <Tag variant="accent" className="text-[10px] px-2.5 py-0.5">
                          {article.category?.title || 'Growth Strategy'}
                        </Tag>
                        <span className="flex items-center gap-1 text-[11px] font-mono text-meta">
                          <Clock size={12} />
                          <span>{article.readingTime || 4} min read</span>
                        </span>
                      </div>

                      <h3 className="font-display font-medium text-lg text-ink mb-2 group-hover:text-accent transition-colors line-clamp-2">
                        {article.title}
                      </h3>

                      <p className="text-soft text-xs leading-relaxed line-clamp-3">
                        {article.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-line text-xs text-meta">
                    <span>{article.author?.name || 'ThunSpark Team'}</span>
                    <span className="text-accent font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read
                      <ArrowRight size={13} />
                    </span>
                  </div>
                </Card>
              </Link>
            </Reveal>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {filteredArticles.length > visibleCount && (
        <div className="text-center pt-8">
          <Button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            variant="secondary"
            size="md"
          >
            Load More Articles
          </Button>
        </div>
      )}
    </div>
  );
}
