/**
 * Cache configuration for different API endpoints
 * Time in seconds
 */
export const CACHE_CONFIG = {
  // News searches - cache for 5 minutes
  newsSearch: 300,
  // Web searches - cache for 10 minutes
  webSearch: 600,
  // Content extraction - cache for 1 hour
  content: 3600,
  // Summaries - cache for 24 hours
  summary: 86400,
  // Enhanced queries - cache for 24 hours
  enhancedQuery: 86400
} as const;

/**
 * Cache tags for revalidation
 */
export const CACHE_TAGS = {
  newsSearch: (query: string) => `news-search-${query}`,
  webSearch: (query: string) => `web-search-${query}`,
  content: (url: string) => `content-${btoa(url)}`,
  summary: (newsId: string | number) => `summary-${newsId}`,
  allNews: 'all-news'
} as const;

/**
 * Helper to create revalidate config for Next.js fetch
 */
export function getRevalidateConfig(cacheType: keyof typeof CACHE_CONFIG) {
  return {
    next: {
      revalidate: CACHE_CONFIG[cacheType]
    }
  };
}

/**
 * Trigger cache revalidation on-demand
 */
export async function revalidateCache(path: string) {
  const secret = process.env.REVALIDATION_SECRET;

  try {
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path,
        ...(secret && { secret })
      })
    });
  } catch (error) {
    console.error(`Failed to revalidate cache path "${path}":`, error);
  }
}
