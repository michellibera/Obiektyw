'use client';

import { useEffect, useState } from 'react';
import type { Story } from '@/lib/newsData';
import { getTopics } from '@/lib/api';

interface UseNewsFetchOptions {
  count?: number;
  enabled?: boolean;
  category?: string;
}

export function useNewsFetch(options: UseNewsFetchOptions = {}) {
  const { count = 20, enabled = true, category } = options;
  const [data, setData] = useState<Story[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getTopics(count, 0, category);

        if (!response.success) {
          throw new Error(response.error || 'Failed to fetch news');
        }

        const stories: Story[] = response.topics.map(topic => ({
          id: topic.id,
          title: topic.objectiveTitle,
          category: topic.category || 'Inne',
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
  }, [count, enabled, category]);

  return { data, loading, error };
}
