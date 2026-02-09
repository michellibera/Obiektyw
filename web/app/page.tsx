'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useNewsFetch } from './hooks';

function CoverageBar({ left, center, right }: { left: number; center: number; right: number }) {
  const total = left + center + right || 1;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ display: 'flex', height: '4px', borderRadius: '2px', overflow: 'hidden', flex: 1, background: 'var(--border)' }}>
        <div style={{ width: `${(left / total) * 100}%`, background: '#C23B3B' }} />
        <div style={{ width: `${(center / total) * 100}%`, background: '#999' }} />
        <div style={{ width: `${(right / total) * 100}%`, background: '#2E5A9E' }} />
      </div>
      <div style={{ display: 'flex', gap: '10px', fontSize: '11px', fontFamily: 'var(--font-archivo)', color: 'var(--muted)' }}>
        <span style={{ color: '#C23B3B' }}>{left}</span>
        <span style={{ color: '#999' }}>{center}</span>
        <span style={{ color: '#2E5A9E' }}>{right}</span>
      </div>
    </div>
  );
}

export default function ObiektywHome() {
  const router = useRouter();
  const { data: stories, loading, error } = useNewsFetch({ count: 20 });
  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <div style={{ marginBottom: '48px' }}>
        <h1 style={{ fontFamily: 'var(--font-archivo)', fontSize: '28px', fontWeight: 600, lineHeight: 1.2, marginBottom: '8px', color: 'var(--fg)' }}>
          Analiza polskich mediów i technik manipulacji
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "18px", lineHeight: 1.6 }}>
                Sprawdź, jak różne źródła informują o tych samych wydarzeniach.
        </p>
      </div>

      {loading && (
        <div style={{ padding: '24px 0', color: 'var(--muted)', fontSize: '13px' }}>
          Ladowanie tematow...
        </div>
      )}

      {error && (
        <div style={{ padding: '24px 0', color: '#C23B3B', fontSize: '13px' }}>
          Blad: {error}
        </div>
      )}

      {!loading && !error && (
        <div style={{ borderTop: '1px solid var(--border)' }}>
          {stories.map((story, i) => (
            <div
              key={story.id}
              onClick={() => router.push(`/news/${story.id}`)}
              style={{
                padding: '20px 0',
                borderBottom: '1px solid var(--border)',
                cursor: 'pointer',
                transition: 'background 0.15s',
                animation: `fadeUp 0.3s ease ${i * 0.04}s both`,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '10px' }}>
                <h3 style={{ fontFamily: 'var(--font-archivo)', fontSize: '18px', fontWeight: 400, lineHeight: 1.35, flex: 1 }}>
                  {story.title}
                  <span style={{ marginLeft: '10px', color: 'var(--subtle)', fontSize: '24px' }}>→</span>
                </h3>
                <span style={{ fontSize: '12px', fontFamily: 'var(--font-archivo)', color: 'var(--subtle)', flexShrink: 0, marginTop: '4px' }}>
                  {story.date ? story.date.slice(0, 10) : ''}
                </span>
              </div>
              {/* <CoverageBar left={story.coverage.left} center={story.coverage.center} right={story.coverage.right} /> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
