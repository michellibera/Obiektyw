'use client';

import { useEffect, useState } from 'react';
import type { Story } from '@/lib/newsData';
import type { BraveSearchResult } from '@/lib/types/brave';

interface UseNewsFetchOptions {
  query?: string;
  count?: number;
  freshness?: string;
  enabled?: boolean;
}

export function useNewsFetch(options: UseNewsFetchOptions = {}) {
  const { query = 'Polska', count = 20, freshness = 'pd', enabled = true } = options;
  const [data, setData] = useState<Story[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `/api/news?q=${encodeURIComponent(query)}&count=${count}&freshness=${freshness}`
        );
        const json = await response.json();

        if (!json.success) {
          throw new Error(json.error || 'Failed to fetch news');
        }

        const stories: Story[] = json.results.map((result: BraveSearchResult, index: number) => {
          const snippets =
            result.extra_snippets && result.extra_snippets.length > 0
              ? result.extra_snippets
              : result.description
                ? [result.description]
                : [];

          return {
            id: index + 1,
            title: result.title,
            category: 'Wiadomości',
            categoryColor: '#525252',
            date: new Date().toISOString(),
            coverage: { left: 0, center: 0, right: 0 },
            blindSpots: [],
            articles: [],
            originalSnippets: snippets
          };
        });

        setData(stories);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [query, count, freshness, enabled]);

  return { data, loading, error };
}
