import React from 'react';
import { PortableText } from '@portabletext/react';
import { Mail, MapPin, Briefcase, Clock } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getJobOpenings, getVerifiedContact } from '@/lib/sanity/fetchers';
import { buildMetadata, serializeJsonLd, ORGANIZATION_SCHEMA_REF } from '@/lib/seo';

function buildJobPostingSchemas(jobs: Array<{ title: string; team: string; location: string; type: string }>) {
  const postedDate = '2026-01-01';
  const validThroughDate = '2026-12-31';

  return jobs.map((job) => ({
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    hiringOrganization: ORGANIZATION_SCHEMA_REF,
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
      },
    },
    employmentType: job.type || 'FULL_TIME',
    datePosted: postedDate,
    validThrough: validThroughDate,
    description: job.title,
  }));
}

export const revalidate = 60;

export const metadata = buildMetadata({
  title: { absolute: 'Careers · ThunSpark' },
  description:
    'Join a focused team of practitioners solving digital growth bottlenecks across analytics, media, and creative.',
  ogTitle: 'Careers · ThunSpark',
  ogDescription:
    'Join a focused team of practitioners solving digital growth bottlenecks across analytics, media, and creative.',
  path: '/careers',
});

export default async function CareersPage() {
  const jobs = await getJobOpenings();
  const contact = await getVerifiedContact();
  const hiringEmail = contact.email || 'hello@thunspark.agency';

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Careers', path: '/careers' },
  ];

  // JobPosting JSON-LD per active role
  const jobSchemas = buildJobPostingSchemas(jobs);

  return (
    <>
      {jobSchemas.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
        />
      ))}

      <div className="pt-28 pb-20 md:pt-36 md:pb-28">
        <Container>
          <div className="mb-8">
            <Breadcrumbs items={breadcrumbs} />
          </div>

          {/* Centered Heading */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <SectionHeading
              eyebrow="CAREERS"
              title="Work with ThunSpark"
              copy="We look for disciplined practitioners who care about provable growth, clear communication, and direct client outcomes."
              align="center"
            />
          </div>

          {/* Short culture-free intro TODO(CONTENT) */}
          <div className="max-w-3xl mx-auto rounded-2xl border border-line bg-card p-6 sm:p-8 mb-16 text-center">
            <p className="text-sm text-soft leading-relaxed">
              We operate as a compact, senior-level growth collective. Our team works directly on strategy,
              media architecture, creative production, and conversion systems without intermediary layers. {/* TODO(CONTENT): refine team operating principles */}
            </p>
          </div>

          {/* Open Roles or Honest Empty State */}
          <div className="max-w-4xl mx-auto">
            {jobs.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-mono text-xs uppercase tracking-widest text-meta font-semibold">
                    OPEN POSITIONS ({jobs.length})
                  </h2>
                </div>

                {jobs.map((job) => (
                  <div
                    key={job._id}
                    className="rounded-2xl border border-line bg-card p-6 sm:p-8 hover:border-line-strong transition-all duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-5 border-b border-line">
                      <div>
                        <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold block mb-1">
                          {job.team}
                        </span>
                        <h3 className="font-display font-medium text-2xl text-ink">
                          {job.title}
                        </h3>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-meta">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-elevated border border-line">
                          <MapPin size={12} className="text-accent" />
                          <span>{job.location}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-elevated border border-line">
                          <Clock size={12} className="text-accent" />
                          <span>{job.type}</span>
                        </span>
                      </div>
                    </div>

                    {job.description && (
                      <div className="prose prose-invert prose-sm max-w-none text-soft mb-6">
                        <PortableText value={job.description} />
                      </div>
                    )}

                    <div className="pt-2">
                      <a
                        href={`mailto:${job.applyEmail || hiringEmail}?subject=${encodeURIComponent(`Application for ${job.title}`)}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-canvas font-mono text-xs font-semibold hover:bg-accent-hi transition-colors"
                      >
                        <Mail size={14} />
                        <span>Apply via Email</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Honest Empty State per spec: "No open roles right now. Send your profile to {email}" */
              <div className="rounded-2xl border border-line bg-card p-10 sm:p-14 text-center max-w-2xl mx-auto space-y-4">
                <div className="w-12 h-12 rounded-full bg-elevated border border-line flex items-center justify-center mx-auto text-accent mb-2">
                  <Briefcase size={20} />
                </div>
                <h3 className="font-display font-medium text-xl text-ink">
                  No open roles right now.
                </h3>
                <p className="text-soft text-sm leading-relaxed max-w-md mx-auto">
                  We don&apos;t keep vanity postings open. When we expand the collective, positions are listed here directly.
                </p>
                <div className="pt-4">
                  <p className="text-xs text-meta mb-3">
                    Think you can bring unique channel or strategy leverage? Send your profile:
                  </p>
                  <a
                    href={`mailto:${hiringEmail}?subject=${encodeURIComponent('Speculative Profile / ThunSpark Collective')}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-canvas font-mono text-xs font-semibold hover:bg-accent-hi transition-colors"
                  >
                    <Mail size={14} />
                    <span>Send profile to {hiringEmail}</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </Container>
      </div>
    </>
  );
}
