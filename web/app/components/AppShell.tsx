'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Wiadomosci' },
  { href: '/na-czasie', label: 'Na czasie' },
  { href: '/o-nas', label: 'O nas' },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)', fontFamily: 'var(--font-archivo)' }}>
      <style>{`
        :root {
          --bg: #FAFAF8;
          --fg: #1A1A18;
          --muted: #888;
          --subtle: #AAA;
          --border: #E8E7E4;
          --hover: #F2F1EE;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: #1A1A18; color: #FAFAF8; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
      `}</style>

      <header style={{ borderBottom: '1px solid var(--border)', background: 'rgba(250,250,248,0.9)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontFamily: 'var(--font-archivo)', fontSize: '22px', color: 'var(--fg)', fontWeight: 600 }}>OBIEKTYW</span>
          </Link>
          <nav style={{ display: 'flex', gap: '2px' }}>
            {navItems.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    textDecoration: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'var(--fg)' : 'var(--muted)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px 80px' }}>
        {children}
      </main>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px', textAlign: 'center', fontSize: '11px', color: 'var(--subtle)', fontFamily: 'var(--font-archivo)' }}>
        OBIEKTYW © 2026
      </footer>
    </div>
  );
}
