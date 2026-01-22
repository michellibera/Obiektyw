'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { SAMPLE_STORIES, type Bias } from '../../lib/newsData';

const biasColors: Record<Bias, string> = {
  left: '#3b6fd1',
  center: '#6b4fa3',
  right: '#c92f35'
};

const biasLabels: Record<Bias, string> = {
  left: 'LEWICA',
  center: 'CENTRUM',
  right: 'PRAWICA'
};

export default function NewsDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const story = SAMPLE_STORIES.find(s => s.id === id);

  if (!story) {
    return (
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '2rem 1rem'
      }}>
        <div style={{
          background: '#ffffff',
          border: '2px solid #525252',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '1rem' }}>
            Nie znaleziono newsa
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
      maxWidth: '900px',
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

      {/* Story Header */}
      <div style={{
        background: '#ffffff',
        border: '2px solid #525252',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <div style={{
            padding: '0.25rem 0.75rem',
            background: '#0a0a0a',
            fontSize: '0.65rem',
            fontWeight: '700',
            color: '#ffffff',
            letterSpacing: '0.05em'
          }}>
            {story.category}
          </div>
          <div style={{
            fontSize: '0.65rem',
            color: '#525252',
            fontWeight: '600'
          }}>
            {new Date(story.date).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        <h1 style={{
          fontSize: '2rem',
          fontWeight: '900',
          margin: '0 0 1.5rem 0',
          color: '#0a0a0a',
          letterSpacing: '-0.02em',
          lineHeight: '1.2'
        }}>
          {story.title}
        </h1>

        {/* Coverage Bar */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{
            fontSize: '0.875rem',
            color: '#525252',
            marginBottom: '0.5rem',
            fontWeight: '600'
          }}>
            Pokrycie medialne:
          </div>
          <div style={{
            display: 'flex',
            height: '24px',
            overflow: 'hidden',
            border: '1px solid #525252'
          }}>
            <div style={{
              flex: story.coverage.left,
              background: '#3b6fd1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '700',
              fontSize: '0.75rem',
              borderRight: '1px solid #525252'
            }}>
              LEWICA {story.coverage.left}
            </div>
            <div style={{
              flex: story.coverage.center,
              background: '#6b4fa3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '700',
              fontSize: '0.75rem',
              borderRight: '1px solid #525252'
            }}>
              CENTRUM {story.coverage.center}
            </div>
            <div style={{
              flex: story.coverage.right,
              background: '#c92f35',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '700',
              fontSize: '0.75rem'
            }}>
              PRAWICA {story.coverage.right}
            </div>
          </div>
        </div>

        {/* Narrative Level */}
        <div>
          <div style={{
            fontSize: '0.875rem',
            color: '#525252',
            marginBottom: '0.5rem',
            fontWeight: '600'
          }}>
            Poziom kreowania narracji:
          </div>
          {(() => {
            const narrativeLevel = Math.round(Math.random() * 100);
            return (
              <div style={{
                display: 'flex',
                height: '24px',
                overflow: 'hidden',
                border: '1px solid #525252'
              }}>
                <div style={{
                  width: `${narrativeLevel}%`,
                  background: '#0a0a0a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '0.75rem',
                  transition: 'width 0.3s ease'
                }}>
                  {narrativeLevel > 10 && `${narrativeLevel}%`}
                </div>
                <div style={{
                  flex: 1,
                  background: '#e5e5e5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: narrativeLevel <= 10 ? 'center' : 'flex-start',
                  color: '#0a0a0a',
                  fontWeight: '700',
                  fontSize: '0.75rem',
                  paddingLeft: narrativeLevel <= 10 ? '0' : '0.5rem'
                }}>
                  {narrativeLevel <= 10 && `${narrativeLevel}%`}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Articles */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '900',
        marginBottom: '1rem',
        color: '#0a0a0a'
      }}>
        Porównanie artykułów
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {story.articles.map((article, index) => (
          <div
            key={index}
            style={{
              background: '#ffffff',
              border: '2px solid #525252',
              padding: '1.5rem'
            }}
          >
            {/* Article Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
              marginBottom: '1rem'
            }}>
              <div>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  color: '#0a0a0a',
                  marginBottom: '0.25rem'
                }}>
                  {article.source}
                </div>
                <div style={{
                  padding: '0.25rem 0.75rem',
                  background: biasColors[article.bias],
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: '700',
                  letterSpacing: '0.05em',
                  display: 'inline-block'
                }}>
                  {biasLabels[article.bias]}
                </div>
              </div>

              {/* Manipulation Score */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {article.manipulationScore > 0.5 && (
                  <AlertTriangle
                    size={16}
                    color="#dc2626"
                    style={{ flexShrink: 0 }}
                  />
                )}
                <div style={{
                  fontSize: '0.75rem',
                  color: '#525252',
                  fontWeight: '600'
                }}>
                  Manipulacja: {Math.round(article.manipulationScore * 100)}%
                </div>
              </div>
            </div>

            {/* Headline */}
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '900',
              color: '#0a0a0a',
              marginBottom: '0.75rem',
              lineHeight: '1.3'
            }}>
              {article.headline}
            </h3>

            {/* Snippet */}
            <p style={{
              fontSize: '0.95rem',
              color: '#525252',
              lineHeight: '1.6',
              margin: 0
            }}>
              {article.snippet}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
