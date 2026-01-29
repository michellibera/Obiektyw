/**
 * Brave Search API Service
 * Server-side only wrapper for Brave Search API
 */

import { env, ensureServerSide } from '../config/env';
import type {
  BraveWebSearchParams,
  BraveNewsSearchParams,
  BraveSearchResponse,
  BraveSearchResult
} from '../types/brave';
import { mockNewsResults } from '../mocks/news';

ensureServerSide();

/**
 * Perform a search request to Brave API
 * @param url - API endpoint URL
 * @param params - Search parameters
 * @returns Brave Search API response
 */
async function performSearch(
  url: string,
  params: BraveWebSearchParams | BraveNewsSearchParams
): Promise<BraveSearchResponse> {
  const searchParams = new URLSearchParams();

  // Automatically add all defined parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const fullUrl = `${url}?${searchParams.toString()}`;

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip',
      'X-Subscription-Token': env.brave.apiKey,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Brave Search API error (${response.status}): ${errorText}`);
  }

  return response.json();
}

/**
 * Search for web results
 * @param query - Search query
 * @param options - Optional search parameters (count: 1-20)
 * @returns Array of web search results
 */
export async function searchWeb(
  query: string,
  options?: Omit<BraveWebSearchParams, 'q'>
): Promise<BraveSearchResult[]> {
  const response = await performSearch(env.brave.webSearchUrl, { q: query, ...options });
  return response.web?.results || [];
}

/**
 * Search for news articles
 * @param query - Search query
 * @param options - Optional search parameters (count: 1-50)
 * @returns Array of news search results
 */
export async function searchNews(
  query: string,
  options?: Omit<BraveNewsSearchParams, 'q'>
): Promise<BraveSearchResult[]> {
  // Return mock data if feature flag is enabled
  if (env.features.useMockNews) {
    console.log('[MOCK MODE] Returning mock news data instead of calling Brave API');
    return mockNewsResults;
  }

  const response = await performSearch(env.brave.newsSearchUrl, { q: query, ...options });
  return response.results || [];
}

/**
 * Filter results by subtype (e.g., 'article')
 * @param results - Search results to filter
 * @param subtype - Subtype to filter by
 * @returns Filtered results
 */
export function filterBySubtype(
  results: BraveSearchResult[],
  subtype: string
): BraveSearchResult[] {
  return results.filter(result => result.subtype === subtype);
}
