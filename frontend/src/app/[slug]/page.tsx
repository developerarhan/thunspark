import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container, Section } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { apiClient } from '@/lib/api-client';

interface LegalPageProps {
  params: Promise<{ slug: string }>;
}

async function getLegalPage(slug: string) {
  try {
    const res = await apiClient.GET('/api/content/legal/{slug}/', {
      params: { path: { slug } },
      next: { tags: [`legal-${slug}`] },
    });
    return res?.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getLegalPage(slug);
  if (!page) return { title: 'Legal Notice' };
  return {
    title: page.meta_title || page.title,
    description: page.meta_description || `Official ${page.title} for Thunspark Agency.`,
  };
}

export default async function DynamicLegalPage({ params }: LegalPageProps) {
  const { slug } = await params;
  const page = (await getLegalPage(slug)) as any;

  if (!page) {
    notFound();
  }

  return (
    <Section className="pt-20 pb-28">
      <Container>
        <div className="max-w-3xl mx-auto">
          <Badge variant="neutral" className="mb-4">
            Compliance & Transparency
          </Badge>
          <h1 className="font-display font-bold text-3xl sm:text-5xl text-text-primary mb-4">
            {page.title}
          </h1>
          <p className="text-xs font-mono text-text-muted mb-10">
            Last Updated: {page.last_updated}
          </p>

          <Card className="p-8 sm:p-12 border-border bg-surface">
            <div
              className="prose prose-invert max-w-none text-text-secondary text-sm leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </Card>
        </div>
      </Container>
    </Section>
  );
}
