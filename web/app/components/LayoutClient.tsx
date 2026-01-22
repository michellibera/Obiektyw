'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getCurrentPage = (): 'wiadomosci' | 'na-czasie' | 'o-nas' => {
    if (pathname === '/na-czasie') return 'na-czasie';
    if (pathname === '/o-nas') return 'o-nas';
    return 'wiadomosci';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fafaf9',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: '#0a0a0a',
      overflowX: 'hidden'
    }}>
      <Header currentPage={getCurrentPage()} />
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {children}
      </main>
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
