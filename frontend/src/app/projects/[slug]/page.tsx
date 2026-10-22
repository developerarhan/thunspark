import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container, Section } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { apiClient } from '@/lib/api-client';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import Link from 'next/link';

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function getProject(slug: string) {
  try {
    const res = await apiClient.GET('/api/projects/items/{slug}/', {
      params: { path: { slug } },
      next: { tags: [`project-${slug}`, 'projects'] },
    });
    return res?.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: 'Project Not Found' };

  return {
    title: project.meta_title || `${project.title} — Case Study`,
    description: project.meta_description || project.short_description,
    openGraph: {
      title: project.og_title || project.title,
      description: project.og_description || project.short_description,
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = (await getProject(slug)) as any;

  if (!project) {
    notFound();
  }

  return (
    <div className="flex flex-col">
      <Section className="pt-20 pb-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-accent transition-colors mb-8"
            >
              <ArrowLeft size={14} />
              <span>Back to Projects</span>
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <Badge variant="accent">
                {project.industry?.name || 'Growth Case Study'}
              </Badge>
              {project.client_name && (
                <span className="text-xs font-mono text-text-muted font-semibold">
                  Client: {project.client_name}
                </span>
              )}
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-text-primary mb-6">
              {project.title}
            </h1>

            <p className="text-text-secondary text-base sm:text-lg leading-relaxed mb-10">
              {project.short_description}
            </p>

            {project.thumbnail && (
              <div className="rounded-2xl overflow-hidden border border-border bg-surface-elevated aspect-video mb-16">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* Narrative Breakdown Sections (Rendered only if populated) */}
      <Section className="py-8 pb-24">
        <Container>
          <div className="max-w-4xl mx-auto space-y-12">
            {[
              { label: 'The Challenge', content: project.challenge },
              { label: 'Strategic Objective', content: project.objective },
              { label: 'Approach & Strategy', content: project.strategy },
              { label: 'Execution', content: project.execution },
              { label: 'Measurable Results', content: project.results },
              { label: 'Key Learnings', content: project.key_learnings },
            ]
              .filter((sec) => Boolean(sec.content))
              .map((sec, idx) => (
                <ScrollReveal key={idx}>
                  <Card className="p-8 border-border bg-surface">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent block mb-3">
                      {sec.label}
                    </span>
                    <div
                      className="prose prose-invert max-w-none text-text-secondary text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: sec.content }}
                    />
                  </Card>
                </ScrollReveal>
              ))}

            {/* Testimonial if present */}
            {project.testimonial_quote && (
              <ScrollReveal>
                <Card className="p-8 sm:p-12 border-accent/40 bg-surface-elevated relative">
                  <Quote size={40} className="text-accent/20 mb-4" />
                  <p className="font-display text-lg sm:text-xl text-text-primary italic leading-relaxed mb-6">
                    &ldquo;{project.testimonial_quote}&rdquo;
                  </p>
                  <div>
                    <h5 className="font-display font-bold text-sm text-text-primary">
                      {project.testimonial_author}
                    </h5>
                    <p className="text-xs text-text-muted">
                      {project.testimonial_role}
                    </p>
                  </div>
                </Card>
              </ScrollReveal>
            )}

            {/* Bottom CTA */}
            <div className="pt-8 text-center">
              <Button href="/contact" size="lg" variant="primary">
                <span>Start a Project Discussion</span>
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
