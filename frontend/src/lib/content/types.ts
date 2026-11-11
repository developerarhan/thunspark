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
