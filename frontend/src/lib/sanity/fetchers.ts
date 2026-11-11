import { cache } from 'react';
import type { PortableTextBlock } from '@portabletext/react';
import { sanityClient } from './client';
import { allPostsQuery, postBySlugQuery } from './queries';

export interface SanityImageObject {
  _type?: 'image';
  asset?: {
    _ref?: string;
    _type?: string;
  };
  alt?: string;
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
