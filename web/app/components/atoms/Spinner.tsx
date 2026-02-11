'use client';

import React from 'react';

interface SpinnerProps {
  size?: number;
  color?: string;
}

export default function Spinner({ size = 20, color = '#525252' }: SpinnerProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `2px solid ${color}`,
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
    >
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
