'use client';

import { useState } from 'react';
import { enhanceQuery as apiEnhanceQuery } from '@/lib/api';

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

      const response = await apiEnhanceQuery(options);

      if (!response.success) {
        throw new Error(response.error || 'Failed to enhance query');
      }

      return response.enhancedQuery || null;
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
