import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ArrowRight } from 'lucide-react';

interface ArticleItem {
  slug: string;
  title: string;
  category: string;
  summary: string;
  date: string;
  readTime: string;
}

export function Section09Insights({ posts = [] }: { posts?: ArticleItem[] }) {
  // Guide §D1 §9 rule: Hidden when 0 published posts
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="py-24 md:py-32 bg-[#0A0A0A] border-t border-[#252525]">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <SectionHeading
            eyebrow="08 / INSIGHTS"
            title={
              <>
                Thinking that <span className="font-italic-accent">earns</span> its keep.
              </>
            }
            copy="Practical strategies on social media, paid media, search, and analytics."
            className="mb-0"
          />

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-mono text-xs text-[#FFD21F] hover:text-[#FFE75A] font-semibold transition-colors shrink-0 group py-2"
          >
            <span>View all insights</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.slice(0, 3).map((post) => (
            <article
              key={post.slug}
              className="group p-8 rounded-xl bg-[#111111] border border-[#252525] hover:border-[#353535] hover:bg-[#171717] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#8A8A85] mb-4">
                  <span className="text-[#FFD21F] uppercase font-semibold">{post.category}</span>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="font-display font-bold text-xl text-[#F5F5F0] mb-3 group-hover:text-[#FFD21F] transition-colors leading-snug">
                  {post.title}
                </h3>

                <p className="text-sm text-[#A6A6A0] leading-relaxed line-clamp-3 mb-6">
                  {post.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-[#252525] text-xs font-mono text-[#8A8A85]">
                {post.date}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
