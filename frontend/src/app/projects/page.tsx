import type { Metadata } from 'next';
import { Container, Section } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { apiClient } from '@/lib/api-client';
import { FolderGit2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Client Projects & Case Studies',
  description:
    'Documented outcomes, strategies, and growth systems engineered for ambitious businesses worldwide.',
};

async function getProjectsData() {
  try {
    const res = await apiClient.GET('/api/projects/items/', {
      next: { tags: ['projects'] },
    });
    if (!res?.data) return [];
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray((res.data as any).results)) return (res.data as any).results;
    return [];
  } catch {
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjectsData();

  return (
    <div className="flex flex-col">
      <Section className="pt-20 pb-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal>
              <Badge variant="accent" className="mb-4">
                Case Documentation
              </Badge>
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-text-primary tracking-tight mb-6">
                Selected Work & <span className="text-accent">Systems.</span>
              </h1>
              <p className="text-text-secondary text-base sm:text-lg leading-relaxed">
                A documented collection of strategic growth systems, channel architectures, and conversion outcomes.
              </p>
            </ScrollReveal>
          </div>
        </Container>
      </Section>

      <Section className="py-8 pb-28">
        <Container>
          {projects.length === 0 ? (
            /* Premium Authentic Empty State (per specification) */
            <div className="max-w-2xl mx-auto">
              <ScrollReveal>
                <Card className="p-8 sm:p-14 text-center border-border bg-surface-elevated">
                  <div className="w-16 h-16 rounded-2xl bg-accent-soft text-accent border border-accent/20 flex items-center justify-center mx-auto mb-6">
                    <FolderGit2 size={30} />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-text-primary mb-3">
                    Building What Comes Next.
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-8 max-w-lg mx-auto">
                    We&apos;re building this portfolio one ambitious project at a time. As we work with businesses around the world, this space will become a collection of the strategies, systems, and outcomes we create.
                  </p>
                  <Button href="/contact" size="md" variant="primary">
                    <span>Work With Us</span>
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Card>
              </ScrollReveal>
            </div>
          ) : (
            /* Dynamic Projects Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project: any) => (
                <ScrollReveal key={project.slug}>
                  <Link href={`/projects/${project.slug}`} className="group block h-full">
                    <Card className="h-full flex flex-col justify-between overflow-hidden border-border bg-surface hover:border-accent/50 transition-all">
                      <div>
                        {project.thumbnail && (
                          <div className="aspect-video w-full overflow-hidden bg-surface-elevated relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={project.thumbnail}
                              alt={project.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-accent block mb-2">
                            {project.industry?.name || 'Growth Engagement'}
                          </span>
                          <h4 className="font-display font-bold text-lg text-text-primary mb-2 group-hover:text-accent transition-colors">
                            {project.title}
                          </h4>
                          <p className="text-text-secondary text-xs leading-relaxed line-clamp-3">
                            {project.short_description}
                          </p>
                        </div>
                      </div>
                      <div className="px-6 pb-6 pt-2 flex items-center text-xs font-semibold text-accent group-hover:translate-x-1 transition-transform">
                        <span>Read Case Study</span>
                        <ArrowRight size={14} className="ml-1" />
                      </div>
                    </Card>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}
