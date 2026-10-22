import type { Metadata } from 'next';
import { Container, Section } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { BlogListingView } from '@/components/blog/BlogListingView';
import { apiClient } from '@/lib/api-client';

export const metadata: Metadata = {
  title: 'Strategic Growth Insights & Editorial',
  description:
    'Deep dives on search intent, conversion rate optimization, customer acquisition economics, and connected digital systems.',
};

async function getBlogData() {
  try {
    const [articlesRes, categoriesRes] = await Promise.all([
      apiClient.GET('/api/blog/articles/', {
        next: { tags: ['articles'] },
      }),
      apiClient.GET('/api/blog/categories/', {
        next: { tags: ['categories'] },
      }),
    ]);

    const unpack = (res: any) => {
      if (!res?.data) return [];
      if (Array.isArray(res.data)) return res.data;
      if (Array.isArray(res.data.results)) return res.data.results;
      return [];
    };

    return {
      articles: unpack(articlesRes),
      categories: unpack(categoriesRes),
    };
  } catch {
    return {
      articles: [],
      categories: [],
    };
  }
}

export default async function BlogPage() {
  const { articles, categories } = await getBlogData();

  return (
    <div className="flex flex-col">
      <Section className="pt-20 pb-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal>
              <Badge variant="accent" className="mb-4">
                Strategy & Intelligence
              </Badge>
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-text-primary tracking-tight mb-6">
                Growth Insights & <span className="text-accent">Playbooks.</span>
              </h1>
              <p className="text-text-secondary text-base sm:text-lg leading-relaxed">
                Practical breakdowns on turning traffic into enterprise pipeline, fixing conversion friction, and scaling unit economics.
              </p>
            </ScrollReveal>
          </div>
        </Container>
      </Section>

      <Section className="py-8 pb-28">
        <Container>
          <BlogListingView initialArticles={articles as any} categories={categories as any} />
        </Container>
      </Section>
    </div>
  );
}
