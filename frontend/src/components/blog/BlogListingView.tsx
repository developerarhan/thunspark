'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Search, Clock, ArrowRight, BookOpen } from 'lucide-react';

interface ArticleItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image?: string;
  featured_image_alt?: string;
  category?: { name: string; slug: string };
  author?: { name: string; role?: string };
  reading_time: number;
  published_at?: string;
}

interface BlogListingViewProps {
  initialArticles: ArticleItem[];
  categories: { id: number; name: string; slug: string }[];
}

export function BlogListingView({ initialArticles, categories }: BlogListingViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(6);

  const filteredArticles = initialArticles.filter((article) => {
    const matchesCategory =
      selectedCategory === 'all' || article.category?.slug === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const visibleArticles = filteredArticles.slice(0, visibleCount);

  return (
    <div className="w-full space-y-12">
      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-border">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-accent text-white'
                : 'bg-surface border border-border text-text-secondary hover:text-text-primary'
            }`}
          >
            All Insights
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                selectedCategory === cat.slug
                  ? 'bg-accent text-white'
                  : 'bg-surface border border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search insights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-surface border border-border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Articles Grid or Empty State */}
      {filteredArticles.length === 0 ? (
        <Card className="p-12 text-center border-border bg-surface-elevated max-w-xl mx-auto">
          <BookOpen size={36} className="text-accent mx-auto mb-4" />
          <h4 className="font-display font-bold text-xl text-text-primary mb-2">
            No Articles Found
          </h4>
          <p className="text-text-secondary text-xs leading-relaxed mb-6">
            We haven&apos;t published insights matching that criteria yet. Check back soon as our strategy team publishes new growth breakdowns.
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
            <ScrollReveal key={article.slug}>
              <Link href={`/blog/${article.slug}`} className="group block h-full">
                <Card className="h-full flex flex-col justify-between overflow-hidden border-border bg-surface hover:border-accent/40 transition-all">
                  <div>
                    {article.featured_image ? (
                      <div className="aspect-[16/10] w-full overflow-hidden bg-surface-elevated relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={article.featured_image}
                          alt={article.featured_image_alt || article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/10] w-full bg-surface-elevated flex items-center justify-center border-b border-border/40">
                        <BookOpen size={28} className="text-accent/30" />
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <Badge variant="accent" className="text-[10px] px-2.5 py-0.5">
                          {article.category?.name || 'Growth Strategy'}
                        </Badge>
                        <span className="flex items-center gap-1 text-[11px] font-mono text-text-muted">
                          <Clock size={12} />
                          <span>{article.reading_time || 4} min read</span>
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-lg text-text-primary mb-2 group-hover:text-accent transition-colors line-clamp-2">
                        {article.title}
                      </h3>

                      <p className="text-text-secondary text-xs leading-relaxed line-clamp-3">
                        {article.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-border/40 text-xs text-text-muted">
                    <span>{article.author?.name || 'Thunspark Team'}</span>
                    <span className="text-accent font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read
                      <ArrowRight size={13} />
                    </span>
                  </div>
                </Card>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      )}

      {/* Cursor "Load More" Button per spec decision */}
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
