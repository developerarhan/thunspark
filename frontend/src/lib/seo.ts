import type { Metadata } from 'next';
import { siteConfig } from '@/site.config';

export const SITE_URL = siteConfig.url.replace(/\/+$/, '');

export interface BuildMetadataOptions {
  title: Metadata['title'];
  description: string;
  path: string;
  ogTitle?: string;
  ogDescription?: string;
  image?: string;
  type?: 'website' | 'article';
  keywords?: string[];
  robots?: Metadata['robots'];
}

function normalizePath(path: string): string {
  if (!path || path === '/') return '/';
  return path.startsWith('/') ? path : `/${path}`;
}

function resolvePlainTitle(title: Metadata['title']): string {
  if (typeof title === 'string') return title;
  if (title && typeof title === 'object') {
    if ('absolute' in title && title.absolute) return title.absolute;
    if ('default' in title && title.default) return title.default;
  }
  return siteConfig.name;
}

export function buildAbsoluteUrl(path: string): string {
  const normalized = normalizePath(path);
  return normalized === '/' ? SITE_URL : `${SITE_URL}${normalized}`;
}

export function buildMetadata({
  title,
  description,
  path,
  ogTitle,
  ogDescription,
  image,
  type = 'website',
  keywords,
  robots,
}: BuildMetadataOptions): Metadata {
  const canonicalPath = normalizePath(path);
  const canonicalUrl = buildAbsoluteUrl(canonicalPath);
  const resolvedTitle = ogTitle || resolvePlainTitle(title);
  const resolvedDescription = ogDescription || description;

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    ...(robots ? { robots } : {}),
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type,
      locale: 'en_IN',
      url: canonicalUrl,
      siteName: siteConfig.name,
      title: resolvedTitle,
      description: resolvedDescription,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description: resolvedDescription,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export const ORGANIZATION_SCHEMA_REF = {
  '@type': 'Organization',
  name: siteConfig.name,
  url: SITE_URL,
} as const;

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: buildAbsoluteUrl(item.path),
    })),
  };
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
