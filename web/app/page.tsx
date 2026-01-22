'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SAMPLE_STORIES } from './lib/newsData';

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
            <div
              key={story.id}
              style={{
                background: '#ffffff',
                border: '2px solid #525252',
                borderRadius: '0',
                overflow: 'hidden',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      marginBottom: '0.75rem'
                    }}>
                      <div style={{
                        padding: '0.25rem 0.75rem',
                        background: '#0a0a0a',
                        borderRadius: '0',
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
                        {new Date(story.date).toLocaleDateString('pl-PL', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                      </div>
                    </div>
                    <h2 style={{
                      fontSize: '1.1rem',
                      fontWeight: '900',
                      margin: '0 0 0.5rem 0',
                      color: '#0a0a0a',
                      letterSpacing: '-0.02em'
                    }}>
                      {story.title}
                    </h2>
                  </div>
                </div>

                {/* Coverage Bar */}
                <div style={{ marginBottom: '0.3rem' }}>
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
                    height: '16px',
                    borderRadius: '0',
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
                      fontSize: '0.55rem',
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
                      fontSize: '0.55rem',
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
                      fontSize: '0.55rem'
                    }}>
                      PRAWICA {story.coverage.right}
                    </div>
                  </div>
                </div>
                </div>

                {/* Narrative Creation Bar */}
                <div style={{ marginBottom: '1rem', padding: '0 1rem' }}>
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
                        height: '16px',
                        borderRadius: '0',
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
                          fontSize: '0.55rem',
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
                          fontSize: '0.55rem',
                          paddingLeft: narrativeLevel <= 10 ? '0' : '0.25rem'
                        }}>
                          {narrativeLevel <= 10 && `${narrativeLevel}%`}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Discrete button to view analysis */}
                <div style={{
                  padding: '1.5rem 1rem 1rem 1rem',
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  <Link
                    href={`/news/${story.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      background: 'transparent',
                      border: '1px solid #525252',
                      color: '#525252',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      letterSpacing: '0.02em',
                      textDecoration: 'none'
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
                    Zobacz więcej
                    <ArrowRight size={14} strokeWidth={2} />
                  </Link>
                </div>
            </div>
          ))}
      </div>
    </>
  );
}
