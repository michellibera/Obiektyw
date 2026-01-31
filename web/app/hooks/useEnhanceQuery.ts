'use client';

import { useState } from 'react';

interface UseEnhanceQueryOptions {
  title: string;
  snippets?: string[];
}

export function useEnhanceQuery() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enhance = async (options: UseEnhanceQueryOptions): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/enhance-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options)
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to enhance query');
      }

      return data.enhancedQuery;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error enhancing query:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { enhance, loading, error };
}
