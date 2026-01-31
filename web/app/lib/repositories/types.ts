import type { BraveSearchResult } from '../types/brave';

export interface SearchOptions {
  count?: number;
  freshness?: string;
  language?: string;
}

export interface NewsRepository {
  searchNews(query: string, options?: SearchOptions): Promise<BraveSearchResult[]>;
  searchWeb(query: string, options?: SearchOptions): Promise<BraveSearchResult[]>;
}
