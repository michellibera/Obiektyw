'use client';

import { useState } from 'react';

interface Article {
  title: string;
  content: string;
  url: string;
}

interface SummarizeResult {
  title: string;
  summary: string;
}

export function useSummarize() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const summarize = async (articles: Article[]): Promise<SummarizeResult | null> => {
    if (!articles.length) return null;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/summarize-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articles })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate summary');
      }

      return {
        title: data.title || '',
        summary: data.summary || ''
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error generating summary:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { summarize, loading, error };
}
