'use client';

import React from 'react';

interface PercentageBarProps {
  value: number;
  label?: string;
  fillColor?: string;
  emptyColor?: string;
  textColor?: string;
  height?: string;
  showPercentage?: boolean;
}

export default function PercentageBar({
  value,
  label,
  fillColor = '#0a0a0a',
  emptyColor = '#e5e5e5',
  textColor = '#ffffff',
  height = '16px',
  showPercentage = true
}: PercentageBarProps) {
  const normalizedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div style={{ marginBottom: '1rem' }}>
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
        <div style={{
          width: `${normalizedValue}%`,
          background: fillColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: textColor,
          fontWeight: '700',
          fontSize: '0.55rem',
          transition: 'width 0.3s ease'
        }}>
          {showPercentage && normalizedValue > 10 && `${normalizedValue}%`}
        </div>
        <div style={{
          flex: 1,
          background: emptyColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: normalizedValue <= 10 ? 'center' : 'flex-start',
          color: '#0a0a0a',
          fontWeight: '700',
          fontSize: '0.55rem',
          paddingLeft: normalizedValue <= 10 ? '0' : '0.25rem'
        }}>
          {showPercentage && normalizedValue <= 10 && `${normalizedValue}%`}
        </div>
      </div>
    </div>
  );
}
