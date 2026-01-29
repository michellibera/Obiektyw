'use client';

import React, { useEffect, useState } from 'react';
import { Story } from './lib/newsData';
import NewsCard from './components/NewsCard';
import type { BraveSearchResult } from './lib/types/brave';

export default function ManipulationAnalyzer() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);
        const response = await fetch('/api/news?q=Polska&count=20&freshness=pd');
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch news');
        }

        // Map Brave results to Story structure (only title for now)
        const mappedStories: Story[] = data.results.map((result: BraveSearchResult, index: number) => ({
          id: index + 1,
          title: result.title,
          category: 'Wiadomości',
          categoryColor: '#525252',
          date: new Date().toISOString(),
          coverage: { left: 0, center: 0, right: 0 },
          blindSpots: [],
          articles: []
        }));

        setStories(mappedStories);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#525252' }}>
        Ładowanie wiadomości...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#c92f35' }}>
        Błąd: {error}
      </div>
    );
  }

  return (
    <>
      {/* Stats Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
      </div>

      {/* Stories List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {stories.map((story, index) => (
          <React.Fragment key={story.id}>
            <NewsCard story={story} />
            {index < stories.length - 1 && (
              <hr style={{
                border: 'none',
                borderTop: '1.5px solid #525252',
                margin: '0'
              }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
