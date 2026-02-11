'use client';

import { useState } from 'react';
import type { DetailedAnalysis } from '@/lib/schemas';
import { summarizeNews } from '@/lib/api';

interface Article {
  title: string;
  content: string;
  url: string;
}

interface SummarizeResult {
  title: string;
  summary: string;
  analysis?: DetailedAnalysis | null;
}

export function useSummarize() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const summarize = async (
    articles: Article[],
    searchPhrase?: string
  ): Promise<SummarizeResult | null> => {
    if (!articles.length) return null;

    try {
      setLoading(true);
      setError(null);

      const response = await summarizeNews({ articles, searchPhrase });

      if (!response.success) {
        throw new Error(response.error || 'Failed to generate summary');
      }

      return {
        title: response.title || '',
        summary: response.summary || '',
        analysis: response.analysis || null
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
