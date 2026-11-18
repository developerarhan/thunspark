import { cache } from 'react';
import type { PortableTextBlock } from '@portabletext/react';
import { sanityClient } from './client';
import { urlForImage } from './image';
import {
  allPostsQuery,
  allProjectsQuery,
  postBySlugQuery,
  allTeamMembersQuery,
  allJobOpeningsQuery,
  siteSettingsQuery,
  allTestimonialsQuery,
  allCreativeShowcasesQuery,
} from './queries';
import type { HomeWorkClient, ProjectDetail } from '@/lib/content/types';
import { FALLBACK_TESTIMONIALS, type TestimonialItem } from '@/lib/content/testimonials';
import { CREATIVE_SHOWCASE, type CreativeCard } from '@/lib/creatives-data';
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
  categories?: string[] | null;
  transformationSummary?: string | null;
  shortDescription?: string | null;
  headline?: string | null;
  overview?: string | null;
  summary?: string | null;
  challenge?: string | null;
  goal?: string | null;
  strategy?: string | null;
  engagementRole?: string | null;
  servicesDelivered?: Array<{ service: string; note?: string | null }> | null;
  scopeTags?: string[] | null;
  services?: string[] | null;
  deliverables?: string[] | null;
  servicesRendered?: string[] | null;
  scope?: string[] | null;
  year?: number | null;
  featured?: boolean | null;
  honestyNote?: string | null;
  logo?: SanityImageObject | null;
  cover?: SanityImageObject | null;
  phaseBrand?: {
    enabled?: boolean;
    title?: string;
    description?: string;
    layoutStyle?: string;
    deliverables?: string[];
    images?: Array<{ image?: SanityImageObject; alt: string; caption?: string }>;
  } | null;
  phaseDigital?: {
    enabled?: boolean;
    title?: string;
    description?: string;
    websiteUrl?: string;
    techStack?: string[];
    uxUiNotes?: string;
    layoutStyle?: string;
    screenshots?: Array<{ image?: SanityImageObject; alt: string; caption?: string }>;
  } | null;
  phaseGrowth?: {
    enabled?: boolean;
    title?: string;
    description?: string;
    channels?: string[];
    seoImprovements?: string;
    layoutStyle?: string;
    creativeAssets?: Array<{ image?: SanityImageObject; alt: string; caption?: string }>;
  } | null;
  result?: {
    outcomeSummary?: string | null;
    keyWins?: string[] | null;
    metrics?: SanityOutcomeItem[] | null;
    testimonial?: {
      quote?: string;
      author?: string;
      title?: string;
      company?: string;
      avatar?: SanityImageObject;
    } | null;
  } | null;
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
  if (!sanityClient) {
    console.warn('[Sanity] sanityClient is not configured. Check NEXT_PUBLIC_SANITY_PROJECT_ID.');
    return [];
  }
  try {
    const posts = await sanityClient.fetch<SanityPostSummary[]>(allPostsQuery);
    return Array.isArray(posts) ? posts : [];
  } catch (err) {
    console.error('[Sanity] Error fetching posts:', err);
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

  const phaseBrand = doc.phaseBrand?.enabled
    ? {
        enabled: true,
        title: doc.phaseBrand.title,
        description: doc.phaseBrand.description,
        layoutStyle: doc.phaseBrand.layoutStyle,
        deliverables: doc.phaseBrand.deliverables || [],
        images: (doc.phaseBrand.images || [])
          .map((img) => {
            const url = img.image ? urlForImage(img.image)?.width(1600).auto('format').url() ?? null : null;
            if (!url) return null;
            return {
              image: url,
              alt: img.alt || `${doc.client} brand asset`,
              caption: img.caption || null,
            };
          })
          .filter((i): i is NonNullable<typeof i> => Boolean(i)),
      }
    : null;

  const phaseDigital = doc.phaseDigital?.enabled
    ? {
        enabled: true,
        title: doc.phaseDigital.title,
        description: doc.phaseDigital.description,
        websiteUrl: doc.phaseDigital.websiteUrl || null,
        techStack: doc.phaseDigital.techStack || [],
        uxUiNotes: doc.phaseDigital.uxUiNotes || null,
        layoutStyle: doc.phaseDigital.layoutStyle,
        screenshots: (doc.phaseDigital.screenshots || [])
          .map((img) => {
            const url = img.image ? urlForImage(img.image)?.width(1600).auto('format').url() ?? null : null;
            if (!url) return null;
            return {
              image: url,
              alt: img.alt || `${doc.client} digital screenshot`,
              caption: img.caption || null,
            };
          })
          .filter((i): i is NonNullable<typeof i> => Boolean(i)),
      }
    : null;

  const phaseGrowth = doc.phaseGrowth?.enabled
    ? {
        enabled: true,
        title: doc.phaseGrowth.title,
        description: doc.phaseGrowth.description,
        channels: doc.phaseGrowth.channels || [],
        seoImprovements: doc.phaseGrowth.seoImprovements || null,
        layoutStyle: doc.phaseGrowth.layoutStyle,
        creativeAssets: (doc.phaseGrowth.creativeAssets || [])
          .map((img) => {
            const url = img.image ? urlForImage(img.image)?.width(1600).auto('format').url() ?? null : null;
            if (!url) return null;
            return {
              image: url,
              alt: img.alt || `${doc.client} ad creative`,
              caption: img.caption || null,
            };
          })
          .filter((i): i is NonNullable<typeof i> => Boolean(i)),
      }
    : null;

  const result = doc.result
    ? {
        outcomeSummary: doc.result.outcomeSummary || null,
        keyWins: doc.result.keyWins || [],
        metrics: (doc.result.metrics || []).map((m) => ({
          label: m.label,
          value: m.value ?? null,
          verified: Boolean(m.verified),
          permission: Boolean(m.permission),
        })),
        testimonial: doc.result.testimonial
          ? {
              quote: doc.result.testimonial.quote || '',
              author: doc.result.testimonial.author || '',
              title: doc.result.testimonial.title || null,
              company: doc.result.testimonial.company || null,
              avatar: doc.result.testimonial.avatar
                ? urlForImage(doc.result.testimonial.avatar)?.width(200).auto('format').url() ?? null
                : null,
            }
          : null,
      }
    : null;

  return {
    slug: doc.slug,
    title: doc.title || doc.headline || doc.client,
    client: doc.client,
    industry: doc.industry || 'Client Engagement',
    year: typeof doc.year === 'number' ? doc.year : new Date().getFullYear(),
    categories: Array.isArray(doc.categories) && doc.categories.length > 0 ? doc.categories : ['full_service'],
    transformationSummary: doc.transformationSummary || rawSummary,
    engagementRole: doc.engagementRole || 'Full-Service Agency Scope',
    servicesDelivered: Array.isArray(doc.servicesDelivered) && doc.servicesDelivered.length > 0
      ? doc.servicesDelivered
      : services.map((s) => ({ service: s })),
    scopeTags: Array.isArray(doc.scopeTags) && doc.scopeTags.length > 0 ? doc.scopeTags : deliverables.slice(0, 4),
    logo: logoUrl,
    cover: coverUrl,
    summary: rawSummary.length <= 110 ? rawSummary : deriveShortDescription(rawSummary),
    overview: doc.overview || doc.headline || doc.client,
    challenge: doc.challenge ?? null,
    goal: doc.goal ?? null,
    strategy: doc.strategy ?? null,
    phaseBrand,
    phaseDigital,
    phaseGrowth,
    result,
    services,
    deliverables,
    outcomes: result?.metrics && result.metrics.length > 0 ? result.metrics : outcomes,
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

export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  photo?: string | null;
  shortBio?: string | null;
  linkedinUrl?: string | null;
  order?: number;
}

export interface SanityTeamMemberDocument {
  _id: string;
  name: string;
  role: string;
  photo?: SanityImageObject | null;
  shortBio?: string | null;
  linkedinUrl?: string | null;
  order?: number | null;
}

export const getTeamMembers = cache(async (): Promise<TeamMember[]> => {
  if (!sanityClient) {
    return [];
  }
  try {
    const docs = await sanityClient.fetch<SanityTeamMemberDocument[]>(allTeamMembersQuery);
    if (!Array.isArray(docs)) return [];
    return docs.map((doc) => ({
      _id: doc._id,
      name: doc.name,
      role: doc.role,
      photo: doc.photo ? urlForImage(doc.photo)?.width(600).height(750).fit('crop').url() || null : null,
      shortBio: doc.shortBio || null,
      linkedinUrl: doc.linkedinUrl || null,
      order: typeof doc.order === 'number' ? doc.order : 0,
    }));
  } catch {
    return [];
  }
});

export interface JobOpening {
  _id: string;
  title: string;
  team: string;
  location: string;
  type: string;
  description?: PortableTextBlock[] | null;
  applyEmail?: string | null;
  active: boolean;
}

export interface SanityJobOpeningDocument {
  _id: string;
  title: string;
  team: string;
  location: string;
  type: string;
  description?: PortableTextBlock[] | null;
  applyEmail?: string | null;
  active?: boolean | null;
}

export const getJobOpenings = cache(async (): Promise<JobOpening[]> => {
  if (!sanityClient) {
    return [];
  }
  try {
    const docs = await sanityClient.fetch<SanityJobOpeningDocument[]>(allJobOpeningsQuery);
    if (!Array.isArray(docs)) return [];
    return docs.map((doc) => ({
      _id: doc._id,
      title: doc.title,
      team: doc.team,
      location: doc.location,
      type: doc.type,
      description: doc.description || null,
      applyEmail: doc.applyEmail || null,
      active: doc.active !== false,
    }));
  } catch {
    return [];
  }
});

export interface SiteSettingsData {
  agencyName?: string | null;
  tagline?: string | null;
  contactEmail?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  address?: string | null;
  socials?: {
    linkedin?: string | null;
    twitter?: string | null;
    instagram?: string | null;
    youtube?: string | null;
    github?: string | null;
  } | null;
}

export interface VerifiedContact {
  email: string;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  socials: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    github?: string;
  };
}

export function isValidContactValue(val: string | null | undefined): boolean {
  if (!val || typeof val !== 'string') return false;
  const clean = val.trim();
  if (clean.length < 5) return false;
  if (/0{4,}/.test(clean)) return false; // eliminates 00000 placeholders
  if (clean.toLowerCase().includes('placeholder')) return false;
  return true;
}

export const getSiteSettings = cache(async (): Promise<SiteSettingsData | null> => {
  if (!sanityClient) {
    return null;
  }
  try {
    const settings = await sanityClient.fetch<SiteSettingsData>(siteSettingsQuery);
    return settings || null;
  } catch {
    return null;
  }
});

export async function getVerifiedContact(): Promise<VerifiedContact> {
  const settings = await getSiteSettings();

  const phone = isValidContactValue(settings?.phone) ? settings!.phone!.trim() : null;
  const whatsapp = isValidContactValue(settings?.whatsapp) ? settings!.whatsapp!.trim() : null;
  const address = isValidContactValue(settings?.address) ? settings!.address!.trim() : null;

  const validUrl = (url?: string | null) => (url && url.startsWith('http') && !url.includes('00000') ? url.trim() : undefined);

  return {
    email: settings?.contactEmail?.trim() || 'hello@thunspark.agency',
    phone,
    whatsapp,
    address,
    socials: {
      linkedin: validUrl(settings?.socials?.linkedin) || 'https://linkedin.com/company/thunspark',
      twitter: validUrl(settings?.socials?.twitter) || 'https://twitter.com/thunspark',
      instagram: validUrl(settings?.socials?.instagram) || 'https://instagram.com/thunspark',
      youtube: validUrl(settings?.socials?.youtube),
      github: validUrl(settings?.socials?.github),
    },
  };
}

export interface SanityTestimonialDocument {
  _id: string;
  clientName: string;
  clientRole?: string | null;
  company: string;
  quote: string;
  verified?: boolean | null;
}

export const getTestimonials = cache(async (): Promise<readonly TestimonialItem[]> => {
  if (!sanityClient) {
    return FALLBACK_TESTIMONIALS;
  }

  try {
    const raw = await sanityClient.fetch<SanityTestimonialDocument[]>(allTestimonialsQuery);
    if (raw && raw.length > 0) {
      return raw.map((t) => ({
        id: t._id,
        author: t.clientName,
        role: t.clientRole || 'Client Partner',
        company: t.company,
        quote: t.quote,
        isVerified: Boolean(t.verified),
        rating: 5,
      }));
    }
  } catch (error) {
    console.warn('[Sanity Fetcher] Testimonials query failed, using fallbacks:', error);
  }
  return FALLBACK_TESTIMONIALS;
});

export interface SanityCreativeShowcaseDocument {
  _id: string;
  title: string;
  client: string;
  category: string;
  metric?: string | null;
  accent?: string | null;
  thumbnail?: SanityImageObject | null;
  projectSlug?: string | null;
  externalUrl?: string | null;
  order?: number | null;
}

export const getCreativeShowcases = cache(async (): Promise<CreativeCard[]> => {
  if (!sanityClient) {
    return CREATIVE_SHOWCASE;
  }

  try {
    const raw = await sanityClient.fetch<SanityCreativeShowcaseDocument[]>(allCreativeShowcasesQuery);
    if (raw && raw.length > 0) {
      const gradients = [
        'from-orange-950/60 via-zinc-900 to-zinc-950',
        'from-blue-950/60 via-zinc-900 to-zinc-950',
        'from-emerald-950/60 via-zinc-900 to-zinc-950',
        'from-purple-950/60 via-zinc-900 to-zinc-950',
        'from-amber-950/60 via-zinc-900 to-zinc-950',
        'from-rose-950/60 via-zinc-900 to-zinc-950',
      ];

      return raw.map((item, idx) => {
        const thumbUrl = item.thumbnail
          ? urlForImage(item.thumbnail)?.width(600).auto('format').url() ?? null
          : null;
        const accent = item.accent || '#FFD21F';
        const bgGradient = gradients[idx % gradients.length];

        return {
          id: item._id,
          title: item.title,
          client: item.client,
          category: item.category,
          metric: item.metric || undefined,
          accent,
          bgGradient,
          thumbnailUrl: thumbUrl,
          projectSlug: item.projectSlug || null,
          externalUrl: item.externalUrl || null,
        };
      });
    }
  } catch (error) {
    console.warn('[Sanity Fetcher] Creative showcase query failed, using fallbacks:', error);
  }

  return CREATIVE_SHOWCASE;
});

