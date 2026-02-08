'use client';

import { useEffect, useState } from 'react';
import type { Story } from '@/lib/newsData';

interface UseNewsFetchOptions {
  count?: number;
  enabled?: boolean;
}

export function useNewsFetch(options: UseNewsFetchOptions = {}) {
  const { count = 20, enabled = true } = options;
  const [data, setData] = useState<Story[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/topics?limit=${count}`);
        const json = await response.json();

        if (!json.success) {
          throw new Error(json.error || 'Failed to fetch news');
        }

        const stories: Story[] = json.topics.map((topic: {
          id: string;
          objectiveTitle: string;
          summary: string;
          lastUpdatedAt: string;
        }) => ({
          id: topic.id,
          title: topic.objectiveTitle,
          category: 'Wiadomości',
          categoryColor: '#525252',
          date: topic.lastUpdatedAt,
          coverage: { left: 0, center: 0, right: 0 },
          blindSpots: [],
          articles: [],
          summary: topic.summary,
        }));

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
  }, [count, enabled]);

  return { data, loading, error };
}
