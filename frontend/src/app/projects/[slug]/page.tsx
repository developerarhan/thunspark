import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Tag } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { BookingButton } from '@/components/ui/BookingButton';
import { Reveal } from '@/components/motion/Reveal';
import { getAllProjectsDetail, getProjectDetailBySlug } from '@/lib/sanity/fetchers';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Layers,
  Sparkles,
  TrendingUp,
  Quote,
  ShieldCheck,
  Code2,
  Palette,
  Target,
  Check,
} from 'lucide-react';
import {
  buildAbsoluteUrl,
  buildBreadcrumbSchema,
  buildMetadata,
  ORGANIZATION_SCHEMA_REF,
  serializeJsonLd,
} from '@/lib/seo';
import type { ProjectGalleryItem } from '@/lib/content/types';

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

  const titleText = study.title || study.headline || `${study.client} Case Study`;
  const descText = study.transformationSummary || study.summary || study.overview;

  return buildMetadata({
    title: { absolute: `${study.client} — ${titleText} | ThunSpark Case Study` },
    description: descText,
    ogTitle: `${study.client}: ${titleText}`,
    ogDescription: descText,
    path: `/projects/${slug}`,
  });
}

function renderVisualGallery(
  items: ProjectGalleryItem[] | undefined,
  layoutStyle: string = 'masonry-gallery',
  aspectRatioClass: string = 'aspect-[16/10]'
) {
  if (!items || items.length === 0) return null;

  if (layoutStyle === 'logo-grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="group rounded-2xl bg-elevated border border-line p-6 flex flex-col items-center justify-center text-center hover:border-accent/40 transition-all shadow-sm"
          >
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-base flex items-center justify-center p-4">
              <Image
                src={item.image}
                alt={item.alt}
                fill
                className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            {item.caption && (
              <span className="text-xs font-mono text-meta group-hover:text-ink transition-colors">
                {item.caption}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (layoutStyle === 'social-grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="group relative rounded-xl overflow-hidden border border-line bg-card shadow-sm aspect-[9/16] hover:border-accent/60 transition-all"
          >
            <Image
              src={item.image}
              alt={item.alt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
            {item.caption && (
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                <p className="text-[11px] font-mono text-white/90 line-clamp-2">
                  {item.caption}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Default: Responsive Masonry / Showcase Grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="group rounded-2xl overflow-hidden border border-line bg-card shadow-md hover:border-accent/50 transition-all flex flex-col"
        >
          <div className={`relative w-full ${aspectRatioClass} bg-[#0c0e14] overflow-hidden`}>
            <Image
              src={item.image}
              alt={item.alt}
              fill
              className="object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {item.caption && (
            <div className="p-4 bg-elevated border-t border-line/60">
              <p className="text-xs font-mono text-soft">{item.caption}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
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
    headline: study.title || study.headline || study.summary,
    description: study.transformationSummary || study.summary || study.overview,
    url: buildAbsoluteUrl(`/projects/${slug}`),
    creator: ORGANIZATION_SCHEMA_REF,
    datePublished: `${study.year}-01-01`,
  };

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: study.client, path: `/projects/${slug}` },
  ]);

  // Verified Outcomes (from result or outcomes)
  const metricsSource = study.result?.metrics && study.result.metrics.length > 0
    ? study.result.metrics
    : study.outcomes || [];

  const verifiedMetrics = metricsSource.filter(
    (item) => item.verified === true && item.permission === true && Boolean(item.label)
  );

  const hasMetrics = verifiedMetrics.length > 0;
  const testimonial = study.result?.testimonial || null;
  const hasTestimonial = Boolean(testimonial?.quote && testimonial.author);
  const keyWins = study.result?.keyWins && study.result.keyWins.length > 0
    ? study.result.keyWins
    : study.deliverables || [];

  const hasPhaseBrand = Boolean(study.phaseBrand?.enabled);
  const hasPhaseDigital = Boolean(study.phaseDigital?.enabled);
  const hasPhaseGrowth = Boolean(study.phaseGrowth?.enabled);

  const servicesDeliveredList = study.servicesDelivered && study.servicesDelivered.length > 0
    ? study.servicesDelivered
    : study.services.map((s) => ({ service: s, note: null }));

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
        {/* ── 1. HERO BANNER & HEADER ── */}
        <section className="pt-28 pb-16 md:pt-36 md:pb-20 border-b border-line">
          <Container>
            <Reveal>
              <div className="max-w-4xl mx-auto text-center mb-10">
                <div className="flex justify-center mb-6">
                  <Breadcrumbs
                    items={[
                      { name: 'Home', path: '/' },
                      { name: 'Projects', path: '/projects' },
                      { name: study.client, path: `/projects/${slug}` },
                    ]}
                    renderSchema={false}
                  />
                </div>

                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-meta hover:text-accent transition-colors mb-6 cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>All Projects &amp; Case Studies</span>
                </Link>

                <div className="flex flex-wrap items-center justify-center gap-2.5 mb-5">
                  <Tag variant="accent">{study.industry}</Tag>
                  <span className="font-mono text-xs text-meta px-3 py-1 rounded-full bg-elevated border border-line">
                    Completed: {study.year}
                  </span>
                  {study.engagementRole && (
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-accent px-3 py-1 rounded-full bg-accent/10 border border-accent/30 font-semibold">
                      <ShieldCheck size={13} />
                      <span>{study.engagementRole}</span>
                    </span>
                  )}
                </div>

                <h1 className="font-display font-medium text-3xl sm:text-5xl lg:text-6xl text-ink tracking-tight mb-6 text-balance">
                  {study.title || study.headline || `${study.client} Growth Transformation.`}
                </h1>

                {study.transformationSummary && (
                  <p className="text-soft text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto text-balance">
                    {study.transformationSummary}
                  </p>
                )}
              </div>
            </Reveal>

            {/* Hero Visual Mockup Banner */}
            <div className="max-w-5xl mx-auto">
              {study.cover ? (
                <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden border border-line bg-card shadow-2xl">
                  <Image
                    src={study.cover}
                    alt={`${study.client} Case Study Hero Visual`}
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="(max-width: 1200px) 100vw, 1200px"
                  />
                </div>
              ) : (
                <div className="w-full rounded-2xl border border-line bg-gradient-to-br from-[#121622] via-[#0b0e14] to-[#050608] p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent font-display font-bold text-2xl sm:text-3xl shrink-0">
                      {study.logo ? (
                        <Image
                          src={study.logo}
                          alt={`${study.client} Logo`}
                          width={60}
                          height={60}
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
                      <h2 className="font-display font-bold text-2xl sm:text-3xl text-ink">
                        {study.client}
                      </h2>
                    </div>
                  </div>

                  {study.phaseDigital?.websiteUrl && (
                    <a
                      href={study.phaseDigital.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-canvas font-mono text-xs font-bold hover:bg-accent-hi transition-colors shrink-0 cursor-pointer"
                    >
                      <span>Visit Live Website</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              )}
            </div>
          </Container>
        </section>

        {/* ── 2. QUICK FACTS & SERVICES DELIVERED CHECKLIST ── */}
        <section className="py-16 md:py-20 border-b border-line bg-card/40">
          <Container>
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Scope Notice & Overview */}
              <div className="lg:col-span-5 space-y-4">
                <span className="font-mono text-xs uppercase tracking-widest text-accent block">
                  ENGAGEMENT SPECIFICATION
                </span>
                <h3 className="font-display font-bold text-2xl text-ink">
                  Scope Boundaries &amp; Role
                </h3>
                <div className="p-4 rounded-xl bg-elevated border border-line space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-accent">
                    <ShieldCheck size={16} />
                    <span className="font-bold">{study.engagementRole || 'Full-Service Agency Scope'}</span>
                  </div>
                  <p className="text-xs text-soft leading-relaxed">
                    Clear scope boundaries guarantee project transparency. Every deliverable listed was executed under this verified engagement contract.
                  </p>
                </div>
                {study.phaseDigital?.websiteUrl && (
                  <div className="pt-2">
                    <a
                      href={study.phaseDigital.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-mono text-accent hover:underline"
                    >
                      <ExternalLink size={13} />
                      <span>{study.phaseDigital.websiteUrl.replace(/^https?:\/\//, '')}</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Right Column: Services Delivered Checklist with Notes */}
              <div className="lg:col-span-7">
                <Card className="p-6 sm:p-8 bg-card border-line">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-meta mb-4 font-bold">
                    Services Delivered Checklist:
                  </h4>
                  <div className="space-y-3">
                    {servicesDeliveredList.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-lg bg-elevated border border-line/60 hover:border-line transition-colors"
                      >
                        <div className="w-5 h-5 rounded-full bg-accent/15 border border-accent/30 text-accent flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={12} className="stroke-[3]" />
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-ink block">
                            {item.service}
                          </span>
                          {item.note && (
                            <span className="text-xs text-meta font-mono mt-0.5 block">
                              {item.note}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

            </div>
          </Container>
        </section>

        {/* ── 3. THE CHALLENGE & GOAL ── */}
        {(study.challenge || study.goal || study.overview) && (
          <section className="py-20 md:py-24 border-b border-line">
            <Container>
              <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center max-w-2xl mx-auto">
                  <span className="font-mono text-xs uppercase tracking-widest text-accent block mb-2">
                    THE STARTING POINT
                  </span>
                  <h2 className="font-display font-medium text-3xl md:text-4xl text-ink tracking-tight">
                    The Challenge &amp; The Goal.
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* The Challenge */}
                  <Card className="p-6 sm:p-8 bg-card border-line relative overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-4">
                      <Target size={20} />
                    </div>
                    <h3 className="font-display font-bold text-xl text-ink mb-3">
                      Where They Started
                    </h3>
                    <p className="text-soft text-sm leading-relaxed">
                      {study.challenge || study.overview}
                    </p>
                  </Card>

                  {/* The Goal */}
                  <Card className="p-6 sm:p-8 bg-card border-line relative overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/30 text-accent flex items-center justify-center mb-4">
                      <Sparkles size={20} />
                    </div>
                    <h3 className="font-display font-bold text-xl text-ink mb-3">
                      Strategic Objective
                    </h3>
                    <p className="text-soft text-sm leading-relaxed">
                      {study.goal ||
                        study.strategy ||
                        'Engineer a resilient growth system connecting brand perception, technical performance, and measurable revenue generation.'}
                    </p>
                  </Card>
                </div>
              </div>
            </Container>
          </section>
        )}

        {/* ── 4. PHASE 1: BRAND IDENTITY & PRINT (MODULAR) ── */}
        {hasPhaseBrand && study.phaseBrand && (
          <section className="py-20 md:py-28 border-b border-line bg-card/20">
            <Container>
              <div className="max-w-5xl mx-auto space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-line">
                  <div>
                    <div className="inline-flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-widest mb-2">
                      <Palette size={14} />
                      <span>PHASE 01: BRAND IDENTITY &amp; PRINT</span>
                    </div>
                    <h2 className="font-display font-medium text-3xl md:text-4xl text-ink tracking-tight">
                      {study.phaseBrand.title || 'Brand Identity & Design System'}
                    </h2>
                  </div>
                  {study.phaseBrand.deliverables && study.phaseBrand.deliverables.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 max-w-md">
                      {study.phaseBrand.deliverables.map((deliv, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-elevated text-soft border border-line"
                        >
                          {deliv}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {study.phaseBrand.description && (
                  <p className="text-soft text-base md:text-lg leading-relaxed max-w-3xl">
                    {study.phaseBrand.description}
                  </p>
                )}

                {/* Visual Gallery for Brand */}
                {renderVisualGallery(
                  study.phaseBrand.images,
                  study.phaseBrand.layoutStyle || 'masonry-gallery',
                  'aspect-[16/10]'
                )}
              </div>
            </Container>
          </section>
        )}

        {/* ── 5. PHASE 2: DIGITAL & WEB PRESENCE (MODULAR) ── */}
        {hasPhaseDigital && study.phaseDigital && (
          <section className="py-20 md:py-28 border-b border-line">
            <Container>
              <div className="max-w-5xl mx-auto space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-line">
                  <div>
                    <div className="inline-flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-widest mb-2">
                      <Code2 size={14} />
                      <span>PHASE 02: DIGITAL &amp; WEB PRESENCE</span>
                    </div>
                    <h2 className="font-display font-medium text-3xl md:text-4xl text-ink tracking-tight">
                      {study.phaseDigital.title || 'Digital Architecture & Web Presence'}
                    </h2>
                  </div>
                  {study.phaseDigital.websiteUrl && (
                    <a
                      href={study.phaseDigital.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-elevated border border-line text-xs font-mono text-ink hover:text-accent hover:border-accent/40 transition-colors shrink-0"
                    >
                      <span>Visit Live Store</span>
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>

                {study.phaseDigital.description && (
                  <p className="text-soft text-base md:text-lg leading-relaxed max-w-3xl">
                    {study.phaseDigital.description}
                  </p>
                )}

                {/* Tech Stack Badges & UX/UI Notes */}
                {(study.phaseDigital.techStack || study.phaseDigital.uxUiNotes) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {study.phaseDigital.techStack && study.phaseDigital.techStack.length > 0 && (
                      <div className="p-4 rounded-xl bg-elevated border border-line space-y-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-meta block">
                          Engineered Tech Stack
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {study.phaseDigital.techStack.map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-card text-accent border border-accent/20 font-semibold"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {study.phaseDigital.uxUiNotes && (
                      <div className="p-4 rounded-xl bg-elevated border border-line space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-meta block">
                          UX / UI Architecture Notes
                        </span>
                        <p className="text-xs text-soft leading-relaxed font-mono">
                          {study.phaseDigital.uxUiNotes}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Screenshots Gallery */}
                {renderVisualGallery(
                  study.phaseDigital.screenshots,
                  study.phaseDigital.layoutStyle || 'device-showcase',
                  'aspect-[16/10]'
                )}
              </div>
            </Container>
          </section>
        )}

        {/* ── 6. PHASE 3: GROWTH & MARKETING (MODULAR) ── */}
        {hasPhaseGrowth && study.phaseGrowth && (
          <section className="py-20 md:py-28 border-b border-line bg-card/20">
            <Container>
              <div className="max-w-5xl mx-auto space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-line">
                  <div>
                    <div className="inline-flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-widest mb-2">
                      <TrendingUp size={14} />
                      <span>PHASE 03: GROWTH &amp; MARKETING</span>
                    </div>
                    <h2 className="font-display font-medium text-3xl md:text-4xl text-ink tracking-tight">
                      {study.phaseGrowth.title || 'Growth & Performance Marketing'}
                    </h2>
                  </div>
                  {study.phaseGrowth.channels && study.phaseGrowth.channels.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 max-w-md">
                      {study.phaseGrowth.channels.map((chan, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-elevated text-emerald-400 border border-emerald-500/20"
                        >
                          {chan}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {study.phaseGrowth.description && (
                  <p className="text-soft text-base md:text-lg leading-relaxed max-w-3xl">
                    {study.phaseGrowth.description}
                  </p>
                )}

                {study.phaseGrowth.seoImprovements && (
                  <div className="p-4 rounded-xl bg-elevated border border-line space-y-1 max-w-2xl">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-meta block">
                      Organic SEO &amp; Content Performance
                    </span>
                    <p className="text-xs text-soft leading-relaxed font-mono">
                      {study.phaseGrowth.seoImprovements}
                    </p>
                  </div>
                )}

                {/* Creatives Visual Gallery */}
                {renderVisualGallery(
                  study.phaseGrowth.creativeAssets,
                  study.phaseGrowth.layoutStyle || 'social-grid',
                  'aspect-[16/10]'
                )}
              </div>
            </Container>
          </section>
        )}

        {/* ── 7. THE RESULT (DUAL LAYOUT WITH GRACEFUL FALLBACK) ── */}
        <section className="py-20 md:py-28 border-b border-line">
          <Container>
            <div className="max-w-5xl mx-auto space-y-12">
              <div className="text-center max-w-2xl mx-auto">
                <span className="font-mono text-xs uppercase tracking-widest text-accent block mb-2">
                  THE MEASURED OUTCOME
                </span>
                <h2 className="font-display font-medium text-3xl md:text-4xl text-ink tracking-tight">
                  Real Results. Real Growth.
                </h2>
                {study.result?.outcomeSummary && (
                  <p className="text-soft text-sm md:text-base leading-relaxed mt-3">
                    {study.result.outcomeSummary}
                  </p>
                )}
              </div>

              {/* DUAL MODE: Both Metrics & Testimonial Available */}
              {hasMetrics && hasTestimonial ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                  {/* Left: KPI Metric Cards (7 cols) */}
                  <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {verifiedMetrics.map((m, idx) => (
                      <Card
                        key={idx}
                        className="p-6 bg-card border-line flex flex-col justify-between"
                      >
                        <span className="text-xs font-mono uppercase tracking-wider text-meta">
                          {m.label}
                        </span>
                        <div className="text-3xl sm:text-4xl font-display font-bold text-accent my-3">
                          {m.value}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                          <CheckCircle2 size={12} />
                          <span>Audited &amp; Verified</span>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Right: Client Testimonial Quote Card (5 cols) */}
                  <div className="lg:col-span-5">
                    <Card className="p-8 h-full flex flex-col justify-between bg-card border-accent/40 shadow-xl relative">
                      <Quote size={28} className="text-accent/40 mb-4" />
                      <p className="text-ink text-sm sm:text-base italic leading-relaxed mb-6">
                        &ldquo;{testimonial?.quote}&rdquo;
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-line">
                        {testimonial?.avatar ? (
                          <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-line">
                            <Image
                              src={testimonial.avatar}
                              alt={testimonial.author || 'Client'}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center font-display font-bold text-accent text-sm shrink-0">
                            {(testimonial?.author || study.client).slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <span className="font-display font-bold text-sm text-ink block">
                            {testimonial?.author}
                          </span>
                          <span className="text-xs font-mono text-meta block">
                            {testimonial?.title ? `${testimonial.title}, ` : ''}{testimonial?.company || study.client}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              ) : hasMetrics ? (
                /* METRICS ONLY */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {verifiedMetrics.map((m, idx) => (
                    <Card
                      key={idx}
                      className="p-6 bg-card border-line flex flex-col justify-between"
                    >
                      <span className="text-xs font-mono uppercase tracking-wider text-meta">
                        {m.label}
                      </span>
                      <div className="text-3xl sm:text-4xl font-display font-bold text-accent my-3">
                        {m.value}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                        <CheckCircle2 size={12} />
                        <span>Audited &amp; Verified</span>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : hasTestimonial ? (
                /* TESTIMONIAL ONLY */
                <div className="max-w-2xl mx-auto">
                  <Card className="p-8 sm:p-10 bg-card border-accent/40 shadow-xl text-center">
                    <Quote size={32} className="text-accent/40 mx-auto mb-4" />
                    <p className="text-ink text-base sm:text-lg italic leading-relaxed mb-6">
                      &ldquo;{testimonial?.quote}&rdquo;
                    </p>
                    <div>
                      <span className="font-display font-bold text-base text-ink block">
                        {testimonial?.author}
                      </span>
                      <span className="text-xs font-mono text-meta block mt-0.5">
                        {testimonial?.title ? `${testimonial.title}, ` : ''}{testimonial?.company || study.client}
                      </span>
                    </div>
                  </Card>
                </div>
              ) : (
                /* GRACEFUL FALLBACK (No metrics, No quote yet) */
                <Card className="p-8 sm:p-10 bg-card border-line max-w-2xl mx-auto text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mx-auto">
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 className="font-display font-bold text-xl text-ink">
                    Engagement Completed to Specification
                  </h3>
                  <p className="text-soft text-sm leading-relaxed">
                    {study.result?.outcomeSummary ||
                      study.overview ||
                      'All deliverables successfully deployed across live production environments.'}
                  </p>
                </Card>
              )}

              {/* Key Wins Checklist */}
              {keyWins.length > 0 && (
                <div className="pt-6 border-t border-line/60 max-w-3xl mx-auto">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-meta mb-4 font-bold text-center">
                    Delivered Capabilities &amp; Key Wins:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {keyWins.map((win, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-elevated border border-line text-xs font-mono text-soft"
                      >
                        <CheckCircle2 size={15} className="text-accent shrink-0 mt-0.5" />
                        <span>{win}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Data Honesty Disclaimer */}
              <div className="text-center">
                <span className="text-xs font-mono text-meta italic">
                  {study.honestyNote || 'Scope-first verified showcase. Detailed revenue metrics remain client-confidential.'}
                </span>
              </div>
            </div>
          </Container>
        </section>

        {/* ── 8. NEXT PROJECT PREVIEW & CALL TO ACTION ── */}
        <section className="py-20 md:py-28">
          <Container>
            <div className="max-w-4xl mx-auto space-y-12">
              {study.nextProject && (
                <div className="p-6 sm:p-8 rounded-2xl bg-card border border-line flex flex-col sm:flex-row items-center justify-between gap-6 group hover:border-accent/40 transition-colors">
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-meta block mb-1">
                      NEXT ENGAGEMENT CASE
                    </span>
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-ink group-hover:text-accent transition-colors">
                      {study.nextProject.client}
                    </h3>
                    <span className="font-mono text-xs text-meta">
                      {study.nextProject.industry}
                    </span>
                  </div>
                  <Link
                    href={`/projects/${study.nextProject.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-elevated border border-line text-xs font-mono text-ink group-hover:text-accent group-hover:border-accent/50 transition-colors shrink-0 cursor-pointer font-semibold"
                  >
                    <span>View Next Case Study</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}

              {/* Strategic Strategy Call Booking CTA */}
              <div className="rounded-2xl border border-line bg-gradient-to-br from-[#121622] via-[#0b0e14] to-[#050608] p-8 sm:p-14 text-center relative overflow-hidden shadow-xl">
                <span className="font-mono text-xs uppercase tracking-widest text-accent block mb-3">
                  READY TO BUILD?
                </span>
                <h2 className="font-display font-medium text-3xl sm:text-4xl text-ink tracking-tight mb-4">
                  Need a similar growth transformation?
                </h2>
                <p className="text-soft text-base leading-relaxed max-w-xl mx-auto mb-8">
                  Book a 30-minute strategy call. We will review your current systems, isolate where revenue leaks, and engineer a customized roadmap.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <BookingButton location="project_detail_bottom_cta" variant="primary" size="lg">
                    <span>Book a strategy call</span>
                    <ArrowRight size={16} />
                  </BookingButton>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
}
