export type ProjectCategory =
  | 'branding_print'
  | 'web_development'
  | 'full_service'
  | 'growth_marketing';

export interface HomeWorkClient {
  slug: string;
  client: string;
  industry: string;
  shortDescription: string;
  logo?: string | null;
  cover?: string | null;
  year: number;
  featured?: boolean;
}

export interface ProjectOutcome {
  label: string;
  value?: string | null;
  verified: boolean;
  permission: boolean;
}

export interface ProjectGalleryItem {
  image: string;
  alt: string;
  caption?: string | null;
}

export interface ProjectServiceDelivered {
  service: string;
  note?: string | null;
}

export interface ProjectPhaseBrand {
  enabled?: boolean;
  title?: string;
  description?: string;
  layoutStyle?: 'masonry-gallery' | 'logo-grid' | 'device-showcase' | 'side-by-side' | 'social-grid' | string;
  images?: ProjectGalleryItem[];
  deliverables?: string[];
}

export interface ProjectPhaseDigital {
  enabled?: boolean;
  title?: string;
  websiteUrl?: string | null;
  description?: string;
  techStack?: string[];
  uxUiNotes?: string | null;
  layoutStyle?: 'device-showcase' | 'masonry-gallery' | 'side-by-side' | 'carousel' | string;
  screenshots?: ProjectGalleryItem[];
}

export interface ProjectPhaseGrowth {
  enabled?: boolean;
  title?: string;
  description?: string;
  channels?: string[];
  seoImprovements?: string | null;
  layoutStyle?: 'social-grid' | 'masonry-gallery' | 'side-by-side' | 'device-showcase' | string;
  creativeAssets?: ProjectGalleryItem[];
}

export interface ProjectTestimonial {
  quote: string;
  author: string;
  title?: string | null;
  company?: string | null;
  avatar?: string | null;
}

export interface ProjectResult {
  outcomeSummary?: string | null;
  keyWins?: string[];
  metrics?: ProjectOutcome[];
  testimonial?: ProjectTestimonial | null;
}

export interface NextProjectLink {
  slug: string;
  client: string;
  industry: string;
}

export interface ProjectDetail {
  slug: string;
  title?: string;
  client: string;
  industry: string;
  year: number;
  categories?: ProjectCategory[] | string[];
  transformationSummary?: string | null;
  logo?: string | null;
  cover?: string | null;

  // Quick Facts & Scope
  engagementRole?: string | null;
  servicesDelivered?: ProjectServiceDelivered[];
  scopeTags?: string[];

  // Challenge & Goal
  challenge?: string | null;
  goal?: string | null;

  // Modular Phases
  phaseBrand?: ProjectPhaseBrand | null;
  phaseDigital?: ProjectPhaseDigital | null;
  phaseGrowth?: ProjectPhaseGrowth | null;

  // The Result
  result?: ProjectResult | null;

  // Legacy & Compatibility Fields
  summary: string;
  overview: string;
  strategy?: string | null;
  services: string[];
  deliverables: string[];
  outcomes?: ProjectOutcome[];
  gallery?: ProjectGalleryItem[];
  nextProject?: NextProjectLink | null;
  headline?: string;
  honestyNote?: string;
}

export interface CaseStudyItem {
  slug: string;
  client: string;
  industry: string;
  year: number;
  categories?: ProjectCategory[] | string[];
  transformationSummary?: string;
  headline?: string;
  overview: string;
  scope: readonly string[] | string[];
  servicesRendered?: readonly string[] | string[];
  scopeTags?: string[];
  cover?: string | null;
  logo?: string | null;
  honestyNote?: string;
}
