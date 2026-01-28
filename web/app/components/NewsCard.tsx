'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Story } from '../lib/newsData';
import PercentageBar from './PercentageBar';
import SegmentedBar from './SegmentedBar';
import Button from './Button';

interface NewsCardProps {
  story: Story;
}

export default function NewsCard({ story }: NewsCardProps) {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1.5px solid #525252',
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
        <SegmentedBar
          label="Pokrycie medialne:"
          segments={[
            { label: 'LEWICA', value: story.coverage.left, color: '#3b6fd1' },
            { label: 'CENTRUM', value: story.coverage.center, color: '#6b4fa3' },
            { label: 'PRAWICA', value: story.coverage.right, color: '#c92f35' }
          ]}
        />
      </div>

      {/* Narrative Creation Bar */}
      <div style={{ padding: '0 1rem' }}>
        <PercentageBar
          value={Math.round(Math.random() * 100)}
          label="Poziom kreowania narracji:"
        />
      </div>

      {/* Discrete button to view analysis */}
      <div style={{
        padding: '1.5rem 1rem 1rem 1rem',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <Button
          href={`/news/${story.id}`}
          variant="outline"
          icon={ArrowRight}
          iconSize={14}
          iconStrokeWidth={2}
        >
          Zobacz więcej
        </Button>
      </div>
    </div>
  );
}
