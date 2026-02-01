import { searchNews, searchWeb } from '../services/brave';
import type { BraveSearchResult } from '../types/brave';
import type { NewsRepository, SearchOptions } from './types';

export class BraveNewsRepository implements NewsRepository {
  async searchNews(
    query: string,
    options?: SearchOptions
  ): Promise<BraveSearchResult[]> {
    return searchNews(query, {
      count: options?.count,
      freshness: options?.freshness,
      extra_snippets: true
    });
  }

  async searchWeb(
    query: string,
    options?: SearchOptions
  ): Promise<BraveSearchResult[]> {
    return searchWeb(query, {
      count: options?.count,
      freshness: options?.freshness,
      extra_snippets: true
    });
  }
}
