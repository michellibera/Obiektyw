'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import NewsCard from '../../components/NewsCard';
import AnalysisDisplay from '../../components/AnalysisDisplay';
import type { BraveSearchResult } from '../../lib/types/brave';
import { Story } from '../../lib/newsData';
import { useNews } from '@/context/NewsContext';
import { useEnhanceQuery, useFetchContent, useSummarize } from '@/hooks';
import type { DetailedAnalysis } from '@/lib/schemas';

export default function NewsDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const { selectedStory, setSelectedStory } = useNews();
  const { enhance } = useEnhanceQuery();
  const { fetchContent } = useFetchContent();
  const { summarize } = useSummarize();

  const [selectedNews, setSelectedNews] = useState<Story | null>(selectedStory);
  const [searchResults, setSearchResults] = useState<BraveSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [generatedTitle, setGeneratedTitle] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<DetailedAnalysis | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        let story = selectedStory;

        if (!story) {
          throw new Error('News data not found. Please select a news from the main page.');
        }

        setSelectedNews(story);

        let searchQuery = story.enhancedQuery;

        if (!searchQuery && story.originalSnippets?.length) {
          try {
            const enhancedQuery = await enhance({
              title: story.title,
              snippets: story.originalSnippets
            });

            if (enhancedQuery) {
              searchQuery = enhancedQuery;
              story = { ...story, enhancedQuery: searchQuery };
              setSelectedStory(story);
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

    if (selectedStory) {
      fetchData();
    }
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

        const articles = [];
        for (const url of articleUrls) {
          const content = await fetchContent(url);
          if (content) {
            articles.push({
              title: searchResults.find(r => r.url === url)?.title || '',
              content: content.content,
              url
            });
          }
        }

        if (articles.length > 0) {
          const searchQuery = selectedNews.enhancedQuery || selectedNews.title;
          const result = await summarize(articles, searchQuery);

          if (result) {
            setSummary(result.summary);
            setGeneratedTitle(result.title);
            setAnalysis(result.analysis || null);

            const updatedStory = {
              ...selectedNews,
              summary: result.summary,
              summaryGeneratedAt: new Date().toISOString()
            };
            setSelectedStory(updatedStory);
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
      padding: '0.5rem 1rem'
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
          marginBottom: '2rem',
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
          {generatedTitle}
        </h1>

        {summaryLoading ? (
          <div style={{
            padding: '1rem',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            color: '#525252',
            fontStyle: 'italic'
          }}>
            Generowanie analizy...
          </div>
        ) : summary ? (
          <div style={{
            fontSize: '0.95rem',
            lineHeight: '1.6',
            color: '#0a0a0a'
          }}>
            {summary.replace(/^#streszczenie\s*/i, '').trim()}
          </div>
        ) : null}
      </div>

      {/* Detailed Analysis */}
      {analysis && !summaryLoading && (
        <AnalysisDisplay analysis={analysis} />
      )}

      {/* Search Results removed */}
    </div>
  );
}
