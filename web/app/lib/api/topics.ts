import { getJson } from './client';
import type { DetailedAnalysis } from '../schemas';

export interface TopicSummary {
  id: string;
  objectiveTitle: string;
  summary: string;
  category?: string;
  lastUpdatedAt: string;
}

export interface TopicsListResponse {
  success: boolean;
  topics: TopicSummary[];
  count: number;
  error?: string;
}

export interface TopicSource {
  title: string;
  url: string;
  source: string;
  publishedAt: string | null;
}

export interface TopicDetail {
  id: string;
  objectiveTitle: string;
  summary: string;
  category?: string;
  analysis: DetailedAnalysis | null;
  sources: TopicSource[];
}

export interface TopicDetailResponse {
  success: boolean;
  topic?: TopicDetail;
  error?: string;
}

export async function getTopics(
  limit: number = 20,
  offset: number = 0,
  category?: string
): Promise<TopicsListResponse> {
  return getJson<TopicsListResponse>('/api/topics', {
    limit,
    offset,
    category: category || undefined,
  });
}

export async function getTopicById(id: string): Promise<TopicDetailResponse> {
  return getJson<TopicDetailResponse>(`/api/topics/${id}`);
}
