import { cache } from 'react';
import type { PortableTextBlock } from '@portabletext/react';
import { sanityClient } from './client';
import { urlForImage } from './image';
import { allPostsQuery, allProjectsQuery, postBySlugQuery } from './queries';
import type { HomeWorkClient } from '@/lib/content/types';
import {
  deriveShortDescription,
  getFallbackHomeWorkClients,
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

export interface SanityProjectDocument {
  _id: string;
  title?: string | null;
  slug: string;
  client: string;
  industry: string;
  shortDescription?: string | null;
  headline?: string | null;
  overview?: string | null;
  year?: number | null;
  featured?: boolean | null;
  logo?: SanityImageObject | null;
  cover?: SanityImageObject | null;
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
