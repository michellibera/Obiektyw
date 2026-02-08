'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AnalysisDisplay from '../../components/AnalysisDisplay';
import type { DetailedAnalysis } from '@/lib/schemas';

interface TopicDetailResponse {
  success: boolean;
  error?: string;
  topic?: {
    id: string;
    objectiveTitle: string;
    summary: string;
    analysis: DetailedAnalysis | null;
  };
}

export default function NewsDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [generatedTitle, setGeneratedTitle] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<DetailedAnalysis | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/topics/${encodeURIComponent(id)}`);
        const data: TopicDetailResponse = await response.json();

        if (!data.success || !data.topic) {
          throw new Error(data.error || 'Failed to fetch topic');
        }

        setGeneratedTitle(data.topic.objectiveTitle || '');
        setSummary(data.topic.summary || '');
        setAnalysis(data.topic.analysis || null);
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

  if (error) {
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

        {summary ? (
          <div style={{
            fontSize: '0.95rem',
            lineHeight: '1.6',
            color: '#0a0a0a'
          }}>
            {summary.replace(/^#streszczenie\s*/i, '').trim()}
          </div>
        ) : null}
      </div>

      {analysis && (
        <AnalysisDisplay analysis={analysis} />
      )}
    </div>
  );
}
