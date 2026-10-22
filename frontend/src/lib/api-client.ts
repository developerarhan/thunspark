import createClient from 'openapi-fetch';
import type { paths } from '@/types/api';

/**
 * Determine dynamic base URL depending on execution environment:
 * - Server Components / ISR running in Node.js container or local machine: INTERNAL_API_URL or localhost:8000
 * - Client Browser fetches: NEXT_PUBLIC_API_URL or localhost:8000
 */
const getBaseUrl = () => {
  if (typeof window === 'undefined') {
    return (
      process.env.INTERNAL_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://127.0.0.1:8000'
    );
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
};

export const apiClient = createClient<paths>({
  baseUrl: getBaseUrl(),
});

export type { paths };
