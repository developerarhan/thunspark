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
  featured_image?: string;
  featured_image_alt?: string;
  category?: { name: string; slug: string };
  author?: { name: string; role?: string };
  reading_time?: number;
  published_at?: string;
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
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-[#252525]">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#FFD21F] text-[#050505] font-bold'
                : 'bg-[#111111] text-[#8A8A85] border border-[#252525] hover:border-[#353535] hover:text-[#F5F5F0]'
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
                  ? 'bg-[#FFD21F] text-[#050505] font-bold'
                  : 'bg-[#111111] text-[#8A8A85] border border-[#252525] hover:border-[#353535] hover:text-[#F5F5F0]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8A85]" />
          <input
            type="text"
            placeholder="Search insights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-[#111111] border border-[#252525] text-xs text-[#F5F5F0] placeholder:text-[#8A8A85] focus:outline-none focus:border-[#FFD21F] transition-colors"
          />
        </div>
      </div>

      {/* Articles Grid or Empty State */}
      {filteredArticles.length === 0 ? (
        <Card className="p-12 text-center border-[#252525] bg-[#111111] max-w-xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-[#171717] border border-[#252525] text-[#FFD21F] flex items-center justify-center mx-auto mb-4">
            <BookOpen size={26} />
          </div>
          <h4 className="font-display font-medium text-2xl text-[#F5F5F0] mb-3">
            Writing What&apos;s Next.
          </h4>
          <p className="text-[#8A8A85] text-xs md:text-sm leading-relaxed mb-6">
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
                <Card className="h-full flex flex-col justify-between overflow-hidden border-[#252525] bg-[#111111] hover:border-[#FFD21F]/40 hover:bg-[#171717] transition-all">
                  <div>
                    {article.featured_image ? (
                      <div className="aspect-[16/10] w-full overflow-hidden bg-[#171717] relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={article.featured_image}
                          alt={article.featured_image_alt || article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/10] w-full bg-[#171717] flex items-center justify-center border-b border-[#252525]">
                        <BookOpen size={28} className="text-[#8A8A85]" />
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <Tag variant="accent" className="text-[10px] px-2.5 py-0.5">
                          {article.category?.name || 'Growth Strategy'}
                        </Tag>
                        <span className="flex items-center gap-1 text-[11px] font-mono text-[#8A8A85]">
                          <Clock size={12} />
                          <span>{article.reading_time || 4} min read</span>
                        </span>
                      </div>

                      <h3 className="font-display font-medium text-lg text-[#F5F5F0] mb-2 group-hover:text-[#FFD21F] transition-colors line-clamp-2">
                        {article.title}
                      </h3>

                      <p className="text-[#8A8A85] text-xs leading-relaxed line-clamp-3">
                        {article.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-[#252525] text-xs text-[#8A8A85]">
                    <span>{article.author?.name || 'ThunSpark Team'}</span>
                    <span className="text-[#FFD21F] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
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
