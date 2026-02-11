'use client';

import { useState } from 'react';
import { fetchContent as apiFetchContent } from '@/lib/api';

interface FetchedContent {
  content: string;
  title: string;
  length: number;
}

export function useFetchContent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async (url: string): Promise<FetchedContent | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFetchContent({ url });

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch content');
      }

      return {
        content: response.content || '',
        title: response.title || '',
        length: response.length || 0
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error(`Error fetching content from ${url}:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchContent, loading, error };
}
