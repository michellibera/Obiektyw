import { getJson } from './client';

export interface NewsSearchParams {
  q: string;
  count?: number;
  freshness?: string;
  type?: 'news' | 'web';
}

export interface NewsSearchResult {
  title: string;
  url: string;
  description?: string;
  published_date?: string;
  extra_snippets?: string[];
  thumbnail?: {
    src?: string;
  };
  profile?: {
    name?: string;
    img?: string;
  };
}

export interface NewsSearchResponse {
  success: boolean;
  results: NewsSearchResult[];
  count: number;
  error?: string;
}

export async function searchNews(params: NewsSearchParams): Promise<NewsSearchResponse> {
  return getJson<NewsSearchResponse>('/api/news', {
    q: params.q,
    count: params.count,
    freshness: params.freshness,
    type: params.type,
  });
}
