import React from 'react';
import { Container, Section } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

interface ArticleItem {
  slug: string;
  title: string;
  category: string;
  summary: string;
  date: string;
  readTime: string;
}

export function Section10Insights({ posts = [] }: { posts?: ArticleItem[] }) {
  // Hidden when 0 published posts (leaves no wrapper, border, or gap)
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <Section tone="base">
      <Container>
        <SectionHeading
          eyebrow="INSIGHTS"
          title={
            <>
              Thinking that <span className="font-italic-accent">earns</span> its keep.
            </>
          }
          copy="Practical strategies on social media, paid media, search, and analytics."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.slice(0, 3).map((post) => (
            <article
              key={post.slug}
              className="group p-8 rounded-xl bg-card border border-line hover:border-line-strong hover:bg-elevated transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-meta mb-4">
                  <span className="text-accent uppercase font-semibold">{post.category}</span>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="font-display font-bold text-xl text-ink mb-3 group-hover:text-accent transition-colors leading-snug">
                  {post.title}
                </h3>

                <p className="text-sm text-soft leading-relaxed line-clamp-3 mb-6">
                  {post.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-line text-xs font-mono text-meta">
                {post.date}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button href="/blog" variant="secondary" size="md">
            <span>View all insights</span>
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </Container>
    </Section>
  );
}
