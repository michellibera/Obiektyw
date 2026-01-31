'use client';

import { useState } from 'react';

interface FetchedContent {
  content: string;
  title: string;
  length: number;
}

export function useFetchContent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = async (url: string): Promise<FetchedContent | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/fetch-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch content');
      }

      return {
        content: data.content,
        title: data.title,
        length: data.length
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

  return { fetch, loading, error };
}
