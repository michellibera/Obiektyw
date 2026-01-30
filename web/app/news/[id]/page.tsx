'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import NewsCard from '../../components/NewsCard';
import type { BraveSearchResult } from '../../lib/types/brave';
import { Story } from '../../lib/newsData';

export default function NewsDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const [selectedNews, setSelectedNews] = useState<Story | null>(null);
  const [searchResults, setSearchResults] = useState<BraveSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Get story from localStorage
        const storedNews = localStorage.getItem('selectedNews');

        if (!storedNews) {
          throw new Error('News data not found. Please select a news from the main page.');
        }

        const story: Story = JSON.parse(storedNews);
        setSelectedNews(story);

        // Search for related articles using web search (not news search) - ONLY ONE API CALL
        const searchResponse = await fetch(
          `/api/news?type=web&q=${encodeURIComponent(story.title)}&count=10&freshness=pw`
        );
        const searchData = await searchResponse.json();

        if (!searchData.success) {
          throw new Error(searchData.error || 'Failed to search news');
        }

        setSearchResults(searchData.results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching news details:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem',
        textAlign: 'center',
        color: '#525252'
      }}>
        Ładowanie...
      </div>
    );
  }

  if (error || !selectedNews) {
    return (
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem'
      }}>
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #525252',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '1rem' }}>
            {error || 'Nie znaleziono newsa'}
          </h1>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: '#0a0a0a',
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginTop: '1rem'
            }}
          >
            <ArrowLeft size={16} />
            Powrót do strony głównej
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 1rem'
    }}>
      {/* Back Button */}
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: 'transparent',
          border: '1px solid #525252',
          color: '#525252',
          textDecoration: 'none',
          fontSize: '0.75rem',
          fontWeight: '600',
          marginBottom: '1.5rem',
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = '#0a0a0a';
          e.currentTarget.style.borderColor = '#0a0a0a';
          e.currentTarget.style.color = '#ffffff';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.borderColor = '#525252';
          e.currentTarget.style.color = '#525252';
        }}
      >
        <ArrowLeft size={14} />
        Powrót
      </Link>

      {/* Main Title */}
      <div style={{
        background: '#ffffff',
        border: '1.5px solid #525252',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: '900',
          margin: '0',
          color: '#0a0a0a',
          letterSpacing: '-0.02em',
          lineHeight: '1.2'
        }}>
          {selectedNews.title}
        </h1>
      </div>

      {/* Search Results */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '900',
        marginBottom: '1rem',
        color: '#0a0a0a'
      }}>
        Powiązane artykuły ({searchResults.length})
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {searchResults.length === 0 ? (
          <div style={{
            background: '#ffffff',
            border: '1.5px solid #525252',
            padding: '2rem',
            textAlign: 'center',
            color: '#525252'
          }}>
            Nie znaleziono powiązanych artykułów
          </div>
        ) : (
          searchResults.map((result, index) => {
            const story: Story = {
              id: index,
              title: result.title,
              category: 'Wiadomości',
              categoryColor: '#525252',
              date: new Date().toISOString(),
              coverage: { left: 0, center: 0, right: 0 },
              blindSpots: [],
              articles: []
            };

            return (
              <React.Fragment key={index}>
                <NewsCard
                  story={story}
                  showCoverageBar={false}
                  showNarrativeBar={true}
                  source={result.profile?.name}
                  sourceUrl={result.url}
                  hideButton={true}
                />
                {index < searchResults.length - 1 && (
                  <hr style={{
                    border: 'none',
                    borderTop: '1.5px solid #525252',
                    margin: '0'
                  }} />
                )}
              </React.Fragment>
            );
          })
        )}
      </div>
    </div>
  );
}
