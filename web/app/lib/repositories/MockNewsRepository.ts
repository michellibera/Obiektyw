import { mockNewsResults } from '../mocks/news';
import type { BraveSearchResult } from '../types/brave';
import type { NewsRepository, SearchOptions } from './types';

export class MockNewsRepository implements NewsRepository {
  async searchNews(
    query: string,
    options?: SearchOptions
  ): Promise<BraveSearchResult[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockNewsResults.slice(0, options?.count || 10);
  }

  async searchWeb(
    query: string,
    options?: SearchOptions
  ): Promise<BraveSearchResult[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockNewsResults.slice(0, options?.count || 10);
  }
}
