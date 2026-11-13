import { cache } from 'react';
import type { PortableTextBlock } from '@portabletext/react';
import { sanityClient } from './client';
import { urlForImage } from './image';
import { allPostsQuery, allProjectsQuery, postBySlugQuery } from './queries';
import type { HomeWorkClient, ProjectDetail } from '@/lib/content/types';
import {
  deriveShortDescription,
  getFallbackHomeWorkClients,
  getFallbackProjectDetails,
  sortHomeWorkClients,
} from '@/lib/content/projects';

export interface SanityImageObject {
  _type?: 'image';
  asset?: {
    _ref?: string;
    _type?: string;
  };
  alt?: string;
}

export interface SanityOutcomeItem {
  label: string;
  value?: string | null;
  verified?: boolean | null;
  permission?: boolean | null;
}

export interface SanityGalleryItem {
  image?: SanityImageObject | null;
  alt: string;
  caption?: string | null;
}

export interface SanityProjectDocument {
  _id: string;
  title?: string | null;
  slug: string;
  client: string;
  industry: string;
  shortDescription?: string | null;
  headline?: string | null;
  overview?: string | null;
  summary?: string | null;
  challenge?: string | null;
  strategy?: string | null;
  services?: string[] | null;
  deliverables?: string[] | null;
  servicesRendered?: string[] | null;
  scope?: string[] | null;
  year?: number | null;
  featured?: boolean | null;
  honestyNote?: string | null;
  logo?: SanityImageObject | null;
  cover?: SanityImageObject | null;
  outcomes?: SanityOutcomeItem[] | null;
  gallery?: SanityGalleryItem[] | null;
}

export interface SanityCategory {
  title: string;
  slug: string;
}

export interface SanityAuthor {
  name: string;
  role?: string | null;
  image?: SanityImageObject | null;
}

export interface SanityPostSummary {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt?: string | null;
  readingTime?: number | null;
  coverImage?: SanityImageObject | null;
  category?: SanityCategory | null;
  author?: SanityAuthor | null;
}

export interface SanityPostDetail extends SanityPostSummary {
  body?: PortableTextBlock[] | null;
}

export const getProjects = cache(async (): Promise<HomeWorkClient[]> => {
  if (!sanityClient) {
    return sortHomeWorkClients(getFallbackHomeWorkClients());
  }

  try {
    const projects = await sanityClient.fetch<SanityProjectDocument[]>(allProjectsQuery);
    if (!Array.isArray(projects) || projects.length === 0) {
      return sortHomeWorkClients(getFallbackHomeWorkClients());
    }

    const mapped: HomeWorkClient[] = projects
      .filter((doc) => Boolean(doc.slug && doc.client))
      .map((doc) => {
        const rawSummary = doc.shortDescription?.trim() || doc.overview || doc.headline || doc.client;
        const logoUrl = doc.logo ? urlForImage(doc.logo)?.width(400).auto('format').url() ?? null : null;
        const coverUrl = doc.cover ? urlForImage(doc.cover)?.width(1200).auto('format').url() ?? null : null;

        return {
          slug: doc.slug,
          client: doc.client,
          industry: doc.industry || 'Client Engagement',
          shortDescription:
            doc.shortDescription && doc.shortDescription.trim().length > 0
              ? doc.shortDescription.trim().slice(0, 110)
              : deriveShortDescription(rawSummary),
          logo: logoUrl,
          cover: coverUrl,
          year: typeof doc.year === 'number' ? doc.year : new Date().getFullYear(),
          featured: Boolean(doc.featured),
        };
      });

    if (mapped.length === 0) {
      return sortHomeWorkClients(getFallbackHomeWorkClients());
    }

    return sortHomeWorkClients(mapped);
  } catch {
    return sortHomeWorkClients(getFallbackHomeWorkClients());
  }
});

export const getAllPosts = cache(async (): Promise<SanityPostSummary[]> => {
  if (!sanityClient) return [];
  try {
    const posts = await sanityClient.fetch<SanityPostSummary[]>(allPostsQuery);
    return Array.isArray(posts) ? posts : [];
  } catch {
    return [];
  }
});

export const getPostBySlug = cache(
  async (slug: string): Promise<SanityPostDetail | null> => {
    if (!sanityClient || !slug) return null;
    try {
      const post = await sanityClient.fetch<SanityPostDetail | null>(
        postBySlugQuery,
        { slug }
      );
      return post ?? null;
    } catch {
      return null;
    }
  }
);

function mapSanityProjectToDetail(doc: SanityProjectDocument): ProjectDetail {
  const rawSummary =
    doc.summary?.trim() || doc.shortDescription?.trim() || doc.overview || doc.headline || doc.client;
  const logoUrl = doc.logo ? urlForImage(doc.logo)?.width(400).auto('format').url() ?? null : null;
  const coverUrl = doc.cover ? urlForImage(doc.cover)?.width(1600).auto('format').url() ?? null : null;

  const services = Array.isArray(doc.services) && doc.services.length > 0
    ? doc.services
    : Array.isArray(doc.servicesRendered)
    ? doc.servicesRendered
    : [];

  const deliverables = Array.isArray(doc.deliverables) && doc.deliverables.length > 0
    ? doc.deliverables
    : Array.isArray(doc.scope)
    ? doc.scope
    : [];

  const outcomes = Array.isArray(doc.outcomes)
    ? doc.outcomes.map((o) => ({
        label: o.label,
        value: o.value ?? null,
        verified: Boolean(o.verified),
        permission: Boolean(o.permission),
      }))
    : [];

  const gallery = Array.isArray(doc.gallery)
    ? doc.gallery
        .map((g) => {
          const imgUrl = g.image ? urlForImage(g.image)?.width(1600).auto('format').url() ?? null : null;
          if (!imgUrl) return null;
          return {
            image: imgUrl,
            alt: g.alt || `${doc.client} visual showcase`,
            caption: g.caption ?? null,
          };
        })
        .filter((g): g is NonNullable<typeof g> => Boolean(g))
    : [];

  return {
    slug: doc.slug,
    client: doc.client,
    industry: doc.industry || 'Client Engagement',
    year: typeof doc.year === 'number' ? doc.year : new Date().getFullYear(),
    logo: logoUrl,
    cover: coverUrl,
    summary: rawSummary.length <= 110 ? rawSummary : deriveShortDescription(rawSummary),
    overview: doc.overview || doc.headline || doc.client,
    challenge: doc.challenge ?? null,
    strategy: doc.strategy ?? null,
    services,
    deliverables,
    outcomes,
    gallery,
    headline: doc.headline ?? undefined,
    honestyNote: doc.honestyNote ?? undefined,
  };
}

export const getAllProjectsDetail = cache(async (): Promise<ProjectDetail[]> => {
  if (!sanityClient) {
    return getFallbackProjectDetails();
  }

  try {
    const docs = await sanityClient.fetch<SanityProjectDocument[]>(allProjectsQuery);
    if (!Array.isArray(docs) || docs.length === 0) {
      return getFallbackProjectDetails();
    }

    const mapped = docs
      .filter((d) => Boolean(d.slug && d.client))
      .map(mapSanityProjectToDetail);

    if (mapped.length === 0) {
      return getFallbackProjectDetails();
    }

    return mapped.map((project, idx, arr) => ({
      ...project,
      nextProject: arr.length > 1
        ? {
            slug: arr[(idx + 1) % arr.length].slug,
            client: arr[(idx + 1) % arr.length].client,
            industry: arr[(idx + 1) % arr.length].industry,
          }
        : null,
    }));
  } catch {
    return getFallbackProjectDetails();
  }
});

export const getProjectDetailBySlug = cache(async (slug: string): Promise<ProjectDetail | null> => {
  if (!slug) return null;
  const all = await getAllProjectsDetail();
  const found = all.find((p) => p.slug === slug);
  if (found) return found;

  const fallbacks = getFallbackProjectDetails();
  return fallbacks.find((p) => p.slug === slug) ?? null;
});
