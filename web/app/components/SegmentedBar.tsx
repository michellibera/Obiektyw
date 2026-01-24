'use client';

import React from 'react';

export interface Segment {
  label: string;
  value: number;
  color: string;
}

interface SegmentedBarProps {
  segments: Segment[];
  label?: string;
  height?: string;
  showValues?: boolean;
}

export default function SegmentedBar({
  segments,
  label,
  height = '16px',
  showValues = true
}: SegmentedBarProps) {
  return (
    <div style={{ marginBottom: '0.3rem' }}>
      {label && (
        <div style={{
          fontSize: '0.875rem',
          color: '#525252',
          marginBottom: '0.5rem',
          fontWeight: '600'
        }}>
          {label}
        </div>
      )}
      <div style={{
        display: 'flex',
        height: height,
        borderRadius: '0',
        overflow: 'hidden',
        border: '1px solid #525252'
      }}>
        {segments.map((segment, index) => (
          <div
            key={index}
            style={{
              flex: segment.value,
              background: segment.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '700',
              fontSize: '0.55rem',
              borderRight: index < segments.length - 1 ? '1px solid #525252' : 'none'
            }}
          >
            {showValues && `${segment.label} ${segment.value}`}
          </div>
        ))}
      </div>
    </div>
  );
}
