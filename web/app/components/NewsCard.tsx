'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Story } from '../lib/newsData';
import PercentageBar from './PercentageBar';
import SegmentedBar from './SegmentedBar';
import Button from './Button';
import { NewsHeader } from './molecules';

interface NewsCardProps {
  story: Story;
  showCoverageBar?: boolean;
  showNarrativeBar?: boolean;
  source?: string;
  sourceUrl?: string;
  hideButton?: boolean;
}

export default function NewsCard({
  story,
  showCoverageBar = true,
  showNarrativeBar = false,
  source,
  sourceUrl,
  hideButton = false
}: NewsCardProps) {
  const router = useRouter();

  const handleViewMore = () => {
    router.push(`/news/${story.id}`);
  };

  return (
    <div
      style={{
        background: '#ffffff',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        maxWidth: '1000px',
        margin: '0 auto',
        width: '100%'
      }}
    >
      <div style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
          <div style={{ flex: 1 }}>
            <NewsHeader
              category={story.category}
              date={story.date}
              source={source}
              sourceUrl={sourceUrl}
            />
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
        {showCoverageBar && (
          <SegmentedBar
            label="Pokrycie medialne:"
            segments={[
              { label: 'LEWICA', value: story.coverage.left, color: '#3b6fd1' },
              { label: 'CENTRUM', value: story.coverage.center, color: '#6b4fa3' },
              { label: 'PRAWICA', value: story.coverage.right, color: '#c92f35' }
            ]}
          />
        )}
      </div>

      {/* Narrative Creation Bar */}
      {showNarrativeBar && (
        <div style={{ padding: '0 1rem' }}>
          <PercentageBar
            value={Math.round(Math.random() * 100)}
            label="Poziom kreowania narracji:"
          />
        </div>
      )}

      {/* Discrete button to view analysis */}
      {!hideButton && (
        <div style={{
          padding: '1.5rem 1rem 1rem 1rem',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <Button
            onClick={handleViewMore}
            variant="outline"
            icon={ArrowRight}
            iconSize={14}
            iconStrokeWidth={2}
          >
            Zobacz więcej
          </Button>
        </div>
      )}
    </div>
  );
}
