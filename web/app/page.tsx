'use client';

import React from 'react';
import NewsCard from './components/NewsCard';
import { useNewsFetch } from './hooks';

export default function ManipulationAnalyzer() {
  const { data: stories, loading, error } = useNewsFetch({
    count: 20
  });

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
