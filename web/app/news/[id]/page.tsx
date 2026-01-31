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
  const [summary, setSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

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

        let searchQuery = story.enhancedQuery;

        if (!searchQuery && story.originalSnippets?.length) {
          try {
            const enhanceResponse = await fetch('/api/enhance-query', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                title: story.title,
                snippets: story.originalSnippets
              })
            });

            const enhanceData = await enhanceResponse.json();

            if (enhanceData.success && enhanceData.enhancedQuery) {
              searchQuery = enhanceData.enhancedQuery;
              story.enhancedQuery = searchQuery;
              localStorage.setItem('selectedNews', JSON.stringify(story));
            }
          } catch (error) {
            console.error('Failed to enhance query:', error);
          }
        }

        searchQuery = searchQuery || story.title;

        const searchResponse = await fetch(
          `/api/news?type=web&q=${encodeURIComponent(searchQuery)}&count=10&freshness=pw`
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

  useEffect(() => {
    async function generateSummary() {
      if (!selectedNews || !searchResults.length) return;

      const CACHE_DURATION = 24 * 60 * 60 * 1000;
      if (selectedNews.summary && selectedNews.summaryGeneratedAt) {
        const age = Date.now() - new Date(selectedNews.summaryGeneratedAt).getTime();
        if (age < CACHE_DURATION) {
          setSummary(selectedNews.summary);
          return;
        }
      }

      setSummaryLoading(true);

      try {
        const articleUrls = searchResults.slice(0, 10).map(r => r.url);

        const fetchPromises = articleUrls.map(async (url) => {
          try {
            const response = await fetch('/api/fetch-content', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url })
            });
            const data = await response.json();
            if (data.success) {
              return {
                title: searchResults.find(r => r.url === url)?.title || '',
                content: data.content,
                url
              };
            }
          } catch (error) {
            console.error(`Failed to fetch ${url}:`, error);
          }
          return null;
        });

        const articles = (await Promise.all(fetchPromises)).filter(a => a !== null);

        if (articles.length > 0) {
          const summaryResponse = await fetch('/api/summarize-news', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ articles })
          });

          const summaryData = await summaryResponse.json();

          if (summaryData.success) {
            setSummary(summaryData.summary);

            const updatedStory = {
              ...selectedNews,
              summary: summaryData.summary,
              summaryGeneratedAt: new Date().toISOString()
            };
            localStorage.setItem('selectedNews', JSON.stringify(updatedStory));
          }
        }
      } catch (error) {
        console.error('Failed to generate summary:', error);
      } finally {
        setSummaryLoading(false);
      }
    }

    generateSummary();
  }, [selectedNews, searchResults]);

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

      {/* Main Title and Summary */}
      <div style={{
        background: '#ffffff',
        border: '1.5px solid #525252',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: '900',
          margin: '0 0 1rem 0',
          color: '#0a0a0a',
          letterSpacing: '-0.02em',
          lineHeight: '1.2'
        }}>
          {selectedNews.title}
        </h1>

        {summaryLoading ? (
          <div style={{
            padding: '1rem',
            background: '#f5f5f5',
            borderLeft: '3px solid #525252',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            color: '#525252',
            fontStyle: 'italic'
          }}>
            Generowanie streszczenia...
          </div>
        ) : summary ? (
          <div style={{
            padding: '1rem',
            background: '#f5f5f5',
            borderLeft: '3px solid #0a0a0a',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            color: '#0a0a0a'
          }}>
            {summary}
          </div>
        ) : null}
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
