import { MetadataRoute } from 'next';
import { apiClient } from '@/lib/api-client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.thunspark.agency';

  // Base primary pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ];

  // Fetch dynamic published articles & projects from Django API
  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    const [articlesRes, projectsRes] = await Promise.all([
      apiClient.GET('/api/blog/articles/'),
      apiClient.GET('/api/projects/items/'),
    ]);

    const unpack = (res: any) => {
      if (!res?.data) return [];
      if (Array.isArray(res.data)) return res.data;
      if (Array.isArray(res.data.results)) return res.data.results;
      return [];
    };

    const articles = unpack(articlesRes);
    const projects = unpack(projectsRes);

    const articleRoutes: MetadataRoute.Sitemap = articles.map((art: any) => ({
      url: `${baseUrl}/blog/${art.slug}`,
      lastModified: art.published_at ? new Date(art.published_at) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

    const projectRoutes: MetadataRoute.Sitemap = projects.map((proj: any) => ({
      url: `${baseUrl}/projects/${proj.slug}`,
      lastModified: proj.published_at ? new Date(proj.published_at) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

    dynamicRoutes = [...articleRoutes, ...projectRoutes];
  } catch {
    // If backend is unreachable during sitemap build, fallback to static routes
  }

  return [...staticRoutes, ...dynamicRoutes];
}
