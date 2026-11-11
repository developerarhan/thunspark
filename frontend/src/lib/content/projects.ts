import { CASE_STUDIES } from '@/lib/constants';
import type { HomeWorkClient } from './types';

export const MAX_HOME_CLIENTS = 8;

/**
 * Derives a compact one-line summary (<= 110 chars) from the opening clause of an overview.
 */
export function deriveShortDescription(text: string, maxChars = 110): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) return '';

  // Prefer first sentence or em-dash clause when complete and concise
  const clauseMatch = normalized.match(/^(.+?)(?:(?:\s+—\s+)|(?:\.\s+)|$)/);
  const firstClause = clauseMatch ? clauseMatch[1].trim() : normalized;

  const candidate = firstClause.length <= maxChars ? firstClause : normalized;
  if (candidate.length <= maxChars) {
    return /[.!?]$/.test(candidate) ? candidate : `${candidate}.`;
  }

  const sliced = candidate.slice(0, maxChars - 1);
  const lastSpace = sliced.lastIndexOf(' ');
  const clipped = (lastSpace > 40 ? sliced.slice(0, lastSpace) : sliced).replace(/[,:;—-]+$/, '');
  return `${clipped}…`;
}

export function sortHomeWorkClients(clients: readonly HomeWorkClient[]): HomeWorkClient[] {
  return [...clients]
    .map((item, idx) => ({ item, idx }))
    .sort((a, b) => {
      const aFeatured = a.item.featured ? 1 : 0;
      const bFeatured = b.item.featured ? 1 : 0;
      if (aFeatured !== bFeatured) return bFeatured - aFeatured;
      if (a.item.year !== b.item.year) return b.item.year - a.item.year;
      return a.idx - b.idx;
    })
    .map(({ item }) => item);
}

export function getFallbackHomeWorkClients(): HomeWorkClient[] {
  const studies: readonly {
    slug: string;
    client: string;
    industry: string;
    shortDescription?: string;
    overview: string;
    year: number;
  }[] = CASE_STUDIES;

  return studies.map((study) => ({
    slug: study.slug,
    client: study.client,
    industry: study.industry,
    shortDescription: study.shortDescription || deriveShortDescription(study.overview),
    logo: null,
    cover: null,
    year: study.year,
    featured: false,
  }));
}
