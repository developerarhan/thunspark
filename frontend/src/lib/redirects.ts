export interface RedirectConfig {
  source: string;
  destination: string;
  permanent: boolean;
}

/**
 * Permanent (301) redirects for domain cutover and legacy URL migrations.
 * Guaranteed no identity redirects (where source === destination).
 */
export const LEGACY_REDIRECTS: RedirectConfig[] = [
  // Core migration redirect
  {
    source: '/products',
    destination: '/services',
    permanent: true,
  },

  // ---------------------------------------------------------------------------
  // PLACEHOLDER FOR LEGACY SITEMAP REDIRECTS:
  // Add additional legacy URLs from the old sitemap here as supplied.
  // Example:
  // {
  //   source: '/legacy-page',
  //   destination: '/target-page',
  //   permanent: true,
  // },
  // ---------------------------------------------------------------------------
];

/**
 * Returns redirects filtered to ensure no identity redirects exist.
 */
export function getRedirects(): RedirectConfig[] {
  return LEGACY_REDIRECTS.filter((r) => r.source !== r.destination);
}
