import { postJson } from './client';
import type { DetailedAnalysis } from '../schemas';

export interface ArticleForAnalysis {
  title: string;
  content: string;
  url: string;
}

export interface SummarizeNewsParams {
  articles: ArticleForAnalysis[];
  searchPhrase?: string;
}

export interface SummarizeNewsResponse {
  success: boolean;
  title?: string;
  summary?: string;
  analysis?: DetailedAnalysis;
  error?: string;
}

export async function summarizeNews(params: SummarizeNewsParams): Promise<SummarizeNewsResponse> {
  return postJson<SummarizeNewsResponse>('/api/summarize-news', params, {
    timeout: 0, // brak timeout
    retries: 1,
  });
}

export interface EnhanceQueryParams {
  title: string;
  snippets?: string[];
}

export interface EnhanceQueryResponse {
  success: boolean;
  enhancedQuery?: string;
  error?: string;
}

export async function enhanceQuery(params: EnhanceQueryParams): Promise<EnhanceQueryResponse> {
  return postJson<EnhanceQueryResponse>('/api/enhance-query', params);
}
