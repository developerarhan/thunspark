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

export interface NextProjectLink {
  slug: string;
  client: string;
  industry: string;
}

export interface ProjectDetail {
  slug: string;
  client: string;
  industry: string;
  year: number;
  logo?: string | null;
  cover?: string | null;
  summary: string;
  overview: string;
  challenge?: string | null;
  strategy?: string | null;
  services: string[];
  deliverables: string[];
  outcomes?: ProjectOutcome[];
  gallery?: ProjectGalleryItem[];
  nextProject?: NextProjectLink | null;
  headline?: string;
  honestyNote?: string;
}
