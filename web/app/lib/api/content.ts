import { postJson } from './client';

export interface FetchContentParams {
  url: string;
}

export interface FetchContentResponse {
  success: boolean;
  content?: string;
  title?: string;
  length?: number;
  error?: string;
}

export async function fetchContent(params: FetchContentParams): Promise<FetchContentResponse> {
  return postJson<FetchContentResponse>('/api/fetch-content', params, {
    timeout: 15000,
    retries: 2,
  });
}
