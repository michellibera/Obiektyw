/**
 * Brave Search API Types
 */

/**
 * Freshness filter values
 * - pd: Past day (24 hours)
 * - pw: Past week (7 days)
 * - pm: Past month (31 days)
 * - py: Past year (1 year)
 * - Custom range: YYYY-MM-DDtoYYYY-MM-DD (e.g., "2022-04-01to2022-07-30")
 */
export type BraveFreshness = 'pd' | 'pw' | 'pm' | 'py' | string;

/**
 * Base parameters for Brave Search API
 */
interface BraveSearchBaseParams {
  /** Search query (required) */
  q: string;
  /** Filter by publication/modification date */
  freshness?: BraveFreshness;
  /** Target results by country (2-char code, e.g., "US", "PL") */
  country?: string;
  /** Filter by content language (ISO 639-1, e.g., "en", "pl") */
  search_lang?: string;
  /** Response metadata language (e.g., "en-US", "pl-PL") */
  ui_lang?: string;
  /** Include additional page excerpts */
  extra_snippets?: boolean;
  /** Adult content filtering level */
  safesearch?: 'off' | 'moderate' | 'strict';
  /** Pagination starting position (0-9) */
  offset?: number;
}

/**
 * Parameters for Brave Web Search API
 */
export interface BraveWebSearchParams extends BraveSearchBaseParams {
  /** Number of results per page (1-20, default: 20) */
  count?: number;
  /** Enable rich result data (sports, stocks, weather) */
  enable_rich_callback?: number;
}

/**
 * Parameters for Brave News Search API
 */
export interface BraveNewsSearchParams extends BraveSearchBaseParams {
  /** Number of results per page (1-50, default: 20) */
  count?: number;
}

/**
 * Individual search result item
 */
export interface BraveSearchResult {
  title: string;
  url: string;
  description?: string;
  age?: string;
  subtype?: string;
  profile?: {
    name: string;
    url?: string;
  };
  /** Additional excerpts (when extra_snippets is enabled) */
  extra_snippets?: string[];
}

/**
 * Complete Brave Search API response
 */
export interface BraveSearchResponse {
  type?: 'web' | 'news';
  query?: {
    original: string;
    altered?: string;
    spellcheck_off?: boolean;
    show_strict_warning?: boolean;
  };
  results?: BraveSearchResult[];
  web?: {
    results: BraveSearchResult[];
  };
  news?: {
    results: BraveSearchResult[];
  };
}
