import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SERVICES_DATA } from '@/lib/services-data';
import { ServiceTemplate } from '@/components/services/ServiceTemplate';
import Script from 'next/script';

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
      title: 'Service Not Found | ThunSpark',
    };
  }

  return {
    title: `${service.name} | ThunSpark Digital Growth`,
    description: service.shortDesc,
    openGraph: {
      title: `${service.name} — ${service.oneLineOutcome}`,
      description: service.shortDesc,
      type: 'website',
      url: `https://thunspark.agency/services/${slug}`,
    },
    alternates: {
      canonical: `/services/${slug}`,
    },
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = SERVICES_DATA[slug];

  if (!service) {
    notFound();
  }

  // Schema: Service & FAQPage JSON-LD
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    serviceType: service.groupName,
    description: service.shortDesc,
    provider: {
      '@type': 'Organization',
      name: 'ThunSpark',
      url: 'https://thunspark.agency',
    },
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

  return (
    <>
      <Script
        id={`service-schema-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {faqSchema && (
        <Script
          id={`service-faq-schema-${slug}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <ServiceTemplate service={service} />
    </>
  );
}
