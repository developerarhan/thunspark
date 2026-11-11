import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SERVICES_DATA } from '@/lib/services-data';
import { ServiceTemplate } from '@/components/services/ServiceTemplate';
import {
  buildAbsoluteUrl,
  buildBreadcrumbSchema,
  buildMetadata,
  ORGANIZATION_SCHEMA_REF,
  serializeJsonLd,
} from '@/lib/seo';

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(SERVICES_DATA).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES_DATA[slug];

  if (!service) {
    return {
      title: 'Service Not Found',
      robots: { index: false, follow: false },
    };
  }

  return buildMetadata({
    title: { absolute: `${service.name} | ThunSpark Digital Growth` },
    description: service.shortDesc,
    ogTitle: `${service.name} — ${service.oneLineOutcome}`,
    ogDescription: service.shortDesc,
    path: `/services/${slug}`,
  });
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = SERVICES_DATA[slug];

  if (!service) {
    notFound();
  }

  const serviceUrl = buildAbsoluteUrl(`/services/${slug}`);

  // Schema: Service, FAQPage & BreadcrumbList JSON-LD
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    serviceType: service.groupName,
    description: service.shortDesc,
    url: serviceUrl,
    provider: ORGANIZATION_SCHEMA_REF,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: service.name,
      itemListElement: service.deliverables.map((item, idx) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: item,
        },
        position: idx + 1,
      })),
    },
  };

  // Service FAQs are authored & verified in SERVICES_DATA (no unconfirmed pricing/contract claims)
  const faqSchema = service.faqs?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: service.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      }
    : null;

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: service.name, path: `/services/${slug}` },
  ]);

  return (
    <>
      <script
        id={`service-schema-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(serviceSchema) }}
      />
      <script
        id={`service-breadcrumb-schema-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          id={`service-faq-schema-${slug}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqSchema) }}
        />
      )}
      <ServiceTemplate service={service} />
    </>
  );
}
