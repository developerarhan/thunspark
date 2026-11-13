import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Tag } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { BookingButton } from '@/components/ui/BookingButton';
import { Reveal } from '@/components/motion/Reveal';
import { getAllProjectsDetail, getProjectDetailBySlug } from '@/lib/sanity/fetchers';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ShieldAlert,
  TrendingUp,
  Layers,
} from 'lucide-react';
import {
  buildAbsoluteUrl,
  buildBreadcrumbSchema,
  buildMetadata,
  ORGANIZATION_SCHEMA_REF,
  serializeJsonLd,
} from '@/lib/seo';

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getAllProjectsDetail();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = await getProjectDetailBySlug(slug);

  if (!study) {
    return {
      title: 'Project Not Found',
      robots: { index: false, follow: false },
    };
  }

  const titleText = study.headline || `${study.client} Growth Case Study`;
  const descText = study.summary || study.overview;

  return buildMetadata({
    title: { absolute: `${study.client} Case Study — ${titleText} | ThunSpark` },
    description: descText,
    ogTitle: `${study.client}: ${titleText}`,
    ogDescription: descText,
    path: `/projects/${slug}`,
  });
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const study = await getProjectDetailBySlug(slug);

  if (!study) {
    notFound();
  }

  const projectSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: `${study.client} Engagement`,
    headline: study.headline || study.summary,
    description: study.summary || study.overview,
    url: buildAbsoluteUrl(`/projects/${slug}`),
    creator: ORGANIZATION_SCHEMA_REF,
    datePublished: `${study.year}-01-01`,
  };

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: study.client, path: `/projects/${slug}` },
  ]);

  // Verified outcomes: metric shows ONLY if verified AND permission are both true
  const verifiedOutcomes = (study.outcomes || []).filter(
    (item) => item.verified === true && item.permission === true && Boolean(item.label)
  );

  const hasDeliverables = Array.isArray(study.deliverables) && study.deliverables.length > 0;
  const hasServices = Array.isArray(study.services) && study.services.length > 0;
  const hasChallenge = Boolean(study.challenge && study.challenge.trim());
  const hasStrategy = Boolean(study.strategy && study.strategy.trim());
  const hasGallery = Array.isArray(study.gallery) && study.gallery.length > 0;

  return (
    <>
      <script
        id={`project-schema-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(projectSchema) }}
      />
      <script
        id={`project-breadcrumb-schema-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }}
      />

      <div className="flex flex-col">
        {/* 1. HERO SECTION */}
        <section className="pt-28 pb-16 md:pt-36 md:pb-20 border-b border-line">
          <Container>
            <Reveal>
              <div className="max-w-4xl mx-auto text-center mb-10">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-meta hover:text-accent transition-colors mb-6"
                >
                  <ArrowLeft size={14} />
                  <span>All Projects</span>
                </Link>

                <div className="flex items-center justify-center gap-3 mb-5">
                  <Tag variant="accent">{study.industry}</Tag>
                  <span className="font-mono text-xs text-meta px-2.5 py-1 rounded bg-elevated border border-line">
                    {study.year}
                  </span>
                </div>

                <h1 className="font-display font-medium text-3xl sm:text-5xl lg:text-6xl text-ink tracking-tight mb-6">
                  {study.headline || `${study.client} Growth System.`}
                </h1>

                {study.summary && (
                  <p className="text-soft text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto">
                    {study.summary}
                  </p>
                )}
              </div>
            </Reveal>

            {/* Cover Image or Monogram Tile */}
            <div className="max-w-5xl mx-auto">
              {study.cover ? (
                <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden border border-line bg-card shadow-sm">
                  <Image
                    src={study.cover}
                    alt={`${study.client} case study showcase`}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1200px) 100vw, 1200px"
                  />
                </div>
              ) : (
                <div className="w-full rounded-2xl border border-line bg-card/60 p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-elevated border border-line-strong flex items-center justify-center text-accent font-display font-bold text-2xl sm:text-3xl shrink-0">
                      {study.logo ? (
                        <Image
                          src={study.logo}
                          alt={`${study.client} logo`}
                          width={56}
                          height={56}
                          className="max-h-12 max-w-12 object-contain"
                        />
                      ) : (
                        study.client.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div>
                      <span className="font-mono text-xs uppercase tracking-widest text-meta block mb-1">
                        CLIENT PARTNER
                      </span>
                      <h2 className="font-display font-medium text-2xl sm:text-3xl text-ink">
                        {study.client}
                      </h2>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {hasServices &&
                      study.services.slice(0, 3).map((service, i) => (
                        <span
                          key={i}
                          className="inline-block px-3 py-1 rounded text-xs font-mono bg-elevated text-accent border border-line"
                        >
                          {service}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </Container>
        </section>

        {/* 2. OVERVIEW & FACTS CARD (Two-Column Layout) */}
        <section className="py-20 md:py-28 border-b border-line">
          <Container>
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Executive Overview */}
              <div className="lg:col-span-7 space-y-6">
                <Reveal>
                  <span className="font-mono text-xs uppercase tracking-widest text-accent block mb-2">
                    EXECUTIVE OVERVIEW
                  </span>
                  <h2 className="font-display font-medium text-3xl md:text-4xl text-ink tracking-tight mb-6">
                    Engineering the growth engine.
                  </h2>
                  <div className="text-soft text-base md:text-lg leading-relaxed space-y-4">
                    <p>{study.overview}</p>
                  </div>
                </Reveal>
              </div>

              {/* Right Column: Facts Card */}
              <div className="lg:col-span-5">
                <Reveal>
                  <Card className="p-6 md:p-8 bg-card border-line space-y-6 lg:sticky lg:top-28">
                    <div className="border-b border-line pb-4">
                      <span className="font-mono text-xs uppercase tracking-wider text-accent block mb-1">
                        ENGAGEMENT SPECIFICATION
                      </span>
                      <h3 className="font-display font-medium text-xl text-ink">
                        Key Parameters
                      </h3>
                    </div>

                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between items-center py-2 border-b border-line/60">
                        <span className="text-meta font-mono text-xs uppercase">Client</span>
                        <span className="text-ink font-medium">{study.client}</span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-line/60">
                        <span className="text-meta font-mono text-xs uppercase">Industry</span>
                        <span className="text-ink font-medium">{study.industry}</span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-line/60">
                        <span className="text-meta font-mono text-xs uppercase">Year</span>
                        <span className="text-ink font-mono">{study.year}</span>
                      </div>

                      {hasServices && (
                        <div className="pt-2">
                          <span className="text-meta font-mono text-xs uppercase block mb-3">
                            Services Rendered
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {study.services.map((svc, idx) => (
                              <span
                                key={idx}
                                className="inline-block px-2.5 py-1 rounded text-xs font-mono bg-elevated text-accent border border-line-strong"
                              >
                                {svc}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </Reveal>
              </div>
            </div>
          </Container>
        </section>

        {/* 3. CHALLENGE & STRATEGY (Rendered conditionally without empty gaps) */}
        {(hasChallenge || hasStrategy) && (
          <section className="py-20 md:py-28 border-b border-line bg-canvas">
            <Container>
              <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
                {hasChallenge && (
                  <Reveal>
                    <Card className="p-8 md:p-10 bg-card border-line h-full flex flex-col justify-between">
                      <div>
                        <span className="font-mono text-xs uppercase tracking-widest text-accent block mb-2">
                          THE BOTTLENECK
                        </span>
                        <h2 className="font-display font-medium text-2xl sm:text-3xl text-ink tracking-tight mb-4">
                          The core challenge.
                        </h2>
                        <p className="text-soft text-base leading-relaxed">
                          {study.challenge}
                        </p>
                      </div>
                    </Card>
                  </Reveal>
                )}

                {hasStrategy && (
                  <Reveal>
                    <Card className="p-8 md:p-10 bg-card border-line h-full flex flex-col justify-between">
                      <div>
                        <span className="font-mono text-xs uppercase tracking-widest text-accent block mb-2">
                          STRATEGIC THESIS
                        </span>
                        <h2 className="font-display font-medium text-2xl sm:text-3xl text-ink tracking-tight mb-4">
                          Our growth strategy.
                        </h2>
                        <p className="text-soft text-base leading-relaxed">
                          {study.strategy}
                        </p>
                      </div>
                    </Card>
                  </Reveal>
                )}
              </div>
            </Container>
          </section>
        )}

        {/* 4. DELIVERABLES (Rendered only when data exists) */}
        {hasDeliverables && (
          <section className="py-20 md:py-28 border-b border-line">
            <Container>
              <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <div className="lg:col-span-5">
                  <Reveal>
                    <span className="font-mono text-xs uppercase tracking-widest text-accent block mb-2">
                      DELIVERY SPECIFICATION
                    </span>
                    <h2 className="font-display font-medium text-3xl md:text-4xl text-ink tracking-tight mb-4">
                      Scope of work delivered.
                    </h2>
                    <p className="text-soft text-sm md:text-base leading-relaxed mb-6">
                      A multi-disciplinary execution engineered to ensure every digital touchpoint reinforces brand authority and conversion velocity.
                    </p>
                    <div className="flex items-center gap-2 text-xs font-mono text-meta">
                      <Layers size={14} className="text-accent" />
                      <span>{study.deliverables.length} Delivered Assets & Modules</span>
                    </div>
                  </Reveal>
                </div>

                <div className="lg:col-span-7">
                  <Card className="p-6 md:p-8 bg-card border-line space-y-4">
                    <h3 className="font-display font-medium text-xl text-ink mb-2">
                      Delivered Capabilities
                    </h3>
                    {study.deliverables.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-4 pb-4 border-b border-line last:border-b-0 last:pb-0"
                      >
                        <CheckCircle2 size={18} className="text-accent shrink-0 mt-0.5" />
                        <span className="text-sm md:text-base text-ink font-medium leading-relaxed">
                          {item}
                        </span>
                      </div>
                    ))}
                  </Card>
                </div>
              </div>
            </Container>
          </section>
        )}

        {/* 5. OUTCOMES & DATA VERIFICATION POLICY */}
        <section className="py-20 md:py-28 bg-alt border-b border-line">
          <Container>
            <div className="max-w-4xl mx-auto space-y-10">
              {/* Verified Metrics (Shows ONLY if verified AND permission are both true) */}
              {verifiedOutcomes.length > 0 && (
                <div className="space-y-4">
                  <div className="text-center max-w-2xl mx-auto mb-8">
                    <span className="font-mono text-xs uppercase tracking-widest text-accent block mb-2">
                      CONFIRMED IMPACT
                    </span>
                    <h2 className="font-display font-medium text-3xl text-ink tracking-tight">
                      Verified Growth Metrics
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {verifiedOutcomes.map((metric, idx) => (
                      <Card
                        key={idx}
                        className="p-6 bg-card border-line text-center space-y-2 relative overflow-hidden"
                      >
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono text-accent bg-elevated border border-line-strong mb-1">
                          <TrendingUp size={12} />
                          <span>Audited Metric</span>
                        </div>
                        {metric.value && (
                          <div className="font-display font-bold text-3xl sm:text-4xl text-ink">
                            {metric.value}
                          </div>
                        )}
                        <div className="text-xs sm:text-sm text-soft font-medium">
                          {metric.label}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Data Verification Policy Block (Kept exactly as is) */}
              <Card className="p-6 md:p-10 bg-card border-line relative overflow-hidden">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-elevated border border-line-strong text-accent flex items-center justify-center shrink-0">
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <span className="font-mono text-xs uppercase tracking-wider text-accent block mb-1">
                      Our Data Verification Policy
                    </span>
                    <h3 className="font-display font-medium text-xl text-ink mb-3">
                      Confidentiality & Verified Metrics
                    </h3>
                    <p className="text-sm md:text-base text-soft leading-relaxed mb-4">
                      {study.honestyNote ||
                        'Scope-first showcase. Verified metrics pending client publication permission.'}
                    </p>
                    <p className="text-xs text-soft leading-relaxed">
                      At ThunSpark, we never fabricate client growth percentages, ROAS figures, or revenue statistics to win new accounts. When clients grant public clearance to share audited unit economics, we publish full post-mortems; until then, we showcase confirmed scope, architecture, and deliverables only.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </Container>
        </section>

        {/* 6. FULL-WIDTH GALLERY (Rendered only when gallery has images) */}
        {hasGallery && (
          <section className="py-20 md:py-28 border-b border-line bg-canvas">
            <Container>
              <div className="max-w-6xl mx-auto">
                <div className="mb-10 text-center max-w-2xl mx-auto">
                  <span className="font-mono text-xs uppercase tracking-widest text-accent block mb-2">
                    VISUAL EXECUTION
                  </span>
                  <h2 className="font-display font-medium text-3xl md:text-4xl text-ink tracking-tight">
                    Project Gallery
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {study.gallery!.map((item, idx) => (
                    <div
                      key={idx}
                      className="group flex flex-col rounded-xl overflow-hidden border border-line bg-card"
                    >
                      <div className="relative w-full aspect-[4/3] bg-elevated overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.alt}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      {item.caption && (
                        <div className="p-3 text-xs text-meta font-mono border-t border-line">
                          {item.caption}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Container>
          </section>
        )}

        {/* 7. NEXT PROJECT NAVIGATION */}
        {study.nextProject && (
          <section className="py-16 md:py-20 border-b border-line bg-card/40">
            <Container>
              <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-accent block mb-1">
                    NEXT ENGAGEMENT
                  </span>
                  <h3 className="font-display font-medium text-2xl text-ink">
                    {study.nextProject.client}
                  </h3>
                  <span className="text-xs text-meta font-mono">
                    {study.nextProject.industry}
                  </span>
                </div>

                <Link
                  href={`/projects/${study.nextProject.slug}`}
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-elevated hover:bg-card text-ink border border-line hover:border-line-strong text-sm font-medium transition-all group"
                >
                  <span>View Case Study</span>
                  <ArrowRight
                    size={16}
                    className="text-accent transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </Container>
          </section>
        )}

        {/* 8. CONVERSION CTA BAND */}
        <section className="py-24 md:py-32">
          <Container>
            <div className="max-w-4xl mx-auto rounded-2xl border border-line bg-card p-8 sm:p-14 text-center relative overflow-hidden">
              <span className="font-mono text-xs uppercase tracking-widest text-accent block mb-3">
                START A CONVERSATION
              </span>
              <h2 className="font-display font-medium text-3xl sm:text-4xl text-ink tracking-tight mb-4">
                Want to build a system like this?
              </h2>
              <p className="text-soft text-base leading-relaxed max-w-xl mx-auto mb-8">
                Book a 30-minute strategy call. We will review your current channels, identify what is holding your growth back, and propose an actionable scope.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <BookingButton location="project_detail_cta" variant="primary" size="lg">
                  <span>Book a strategy call</span>
                  <ArrowRight size={16} />
                </BookingButton>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
}
