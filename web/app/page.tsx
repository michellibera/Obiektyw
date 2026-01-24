'use client';

import React from 'react';
import { SAMPLE_STORIES } from './lib/newsData';
import NewsCard from './components/NewsCard';

export default function ManipulationAnalyzer() {
  const filteredStories = SAMPLE_STORIES;

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
        {filteredStories.map(story => (
          <NewsCard key={story.id} story={story} />
        ))}
      </div>
    </>
  );
}
