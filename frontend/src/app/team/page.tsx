import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getTeamMembers } from '@/lib/sanity/fetchers';
import { buildMetadata, serializeJsonLd, ORGANIZATION_SCHEMA_REF } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata() {
  const members = await getTeamMembers();
  if (members.length === 0) {
    return {
      title: 'Not Found',
      robots: { index: false, follow: false },
    };
  }

  return buildMetadata({
    title: { absolute: 'The Team · ThunSpark' },
    description: 'Meet the strategists, growth practitioners, and creatives behind ThunSpark.',
    ogTitle: 'The Team · ThunSpark',
    ogDescription: 'Meet the strategists, growth practitioners, and creatives behind ThunSpark.',
    path: '/team',
  });
}

export default async function TeamPage() {
  const members = await getTeamMembers();

  // Route returns notFound if zero members are published in Sanity
  if (!members || members.length === 0) {
    notFound();
  }

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Team', path: '/team' },
  ];

  // Person JSON-LD per published member
  const personSchemas = members.map((member) => ({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: member.name,
    jobTitle: member.role,
    ...(member.photo ? { image: member.photo } : {}),
    ...(member.shortBio ? { description: member.shortBio } : {}),
    ...(member.linkedinUrl ? { url: member.linkedinUrl } : {}),
    worksFor: ORGANIZATION_SCHEMA_REF,
  }));

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {personSchemas.map((schema, idx) => (
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

          <div className="text-center max-w-2xl mx-auto mb-16">
            <SectionHeading
              eyebrow="OUR PEOPLE"
              title="Built by Practitioners"
              copy="A tight team connecting deep channel expertise with business accountability."
              align="center"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member) => (
              <div
                key={member._id}
                className="group rounded-2xl border border-line bg-card p-6 flex flex-col justify-between hover:border-line-strong transition-all duration-200"
              >
                <div>
                  <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-elevated mb-5 border border-line">
                    {member.photo ? (
                      <Image
                        src={member.photo}
                        alt={`${member.name} — ${member.role}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-display font-bold text-4xl text-accent/70 select-none">
                        {getInitials(member.name)}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 mb-3">
                    <h2 className="font-display font-medium text-xl text-ink">
                      {member.name}
                    </h2>
                    <p className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                      {member.role}
                    </p>
                  </div>

                  {member.shortBio && (
                    <p className="text-soft text-sm leading-relaxed mb-4">
                      {member.shortBio}
                    </p>
                  )}
                </div>

                {member.linkedinUrl && (
                  <div className="pt-4 border-t border-line/60 mt-auto">
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-meta hover:text-accent transition-colors"
                      aria-label={`${member.name} on LinkedIn`}
                    >
                      <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z"/>
                      </svg>
                      <span>LinkedIn Profile</span>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Container>
      </div>
    </>
  );
}
