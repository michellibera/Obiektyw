'use client';

import React from 'react';
import Link from 'next/link';

interface HeaderProps {
  currentPage: 'wiadomosci' | 'na-czasie' | 'o-nas';
}

export default function Header({ currentPage }: HeaderProps) {
  const [trianglePosition, setTrianglePosition] = React.useState(0);
  const categoryRefsRef = React.useRef<Record<string, HTMLAnchorElement | null>>({});

  const menuItems = [
    { id: 'wiadomosci', label: 'Wiadomości', href: '/' },
    { id: 'na-czasie', label: 'Na czasie', href: '/na-czasie' },
    { id: 'o-nas', label: 'O nas', href: '/o-nas' }
  ];

  const updateTrianglePosition = React.useCallback(() => {
    if (categoryRefsRef.current[currentPage]) {
      const buttonRect = categoryRefsRef.current[currentPage]!.getBoundingClientRect();
      const triangleContainer = document.querySelector('[data-triangle-container]');
      if (triangleContainer) {
        const triangleRect = triangleContainer.getBoundingClientRect();
        const position = buttonRect.left - triangleRect.left + buttonRect.width / 2;
        setTrianglePosition(position);
      }
    }
  }, [currentPage]);

  React.useEffect(() => {
    updateTrianglePosition();
    window.addEventListener('resize', updateTrianglePosition);
    return () => window.removeEventListener('resize', updateTrianglePosition);
  }, [updateTrianglePosition]);

  React.useEffect(() => {
    const timer = setTimeout(updateTrianglePosition, 100);
    return () => clearTimeout(timer);
  }, [updateTrianglePosition]);

  return (
    <header style={{
      background: '#ffffff',
      borderBottom: '2px solid #525252',
      padding: '0.75rem 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.25rem' }}>
          <h1 style={{
            fontSize: '1.25rem',
            fontWeight: '900',
            margin: 0,
            color: '#0a0a0a',
            letterSpacing: '-0.02em'
          }}>
            OBIEKTYW
          </h1>
        </div>
        <p style={{
          margin: '0 0 0.5rem 0',
          color: '#0a0a0a',
          fontSize: '0.85rem',
          fontWeight: '500'
        }}>
          Analiza polskich mediów i technik manipulacji
        </p>

        {/* Top divider line */}
        <div style={{
          height: '2px',
          background: '#525252',
          marginBottom: '0.5rem',
          width: 'calc(100% + 4rem)',
          marginLeft: '-2rem'
        }} />

        {/* Knurled pattern - vertical lines */}
        <div style={{
          height: '8px',
          marginBottom: '0.5rem',
          width: 'calc(200% + 4rem)',
          marginLeft: '-30%',
          display: 'flex',
          position: 'relative',
          transform: `translateX(${trianglePosition - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)}px)`,
          transition: 'transform 0.3s ease',
          overflow: 'hidden'
        }}>
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${i * 0.9}%`,
                height: '100%',
                width: '1px',
                background: '#525252'
              }}
            />
          ))}
        </div>

        {/* Divider with triangle */}
        <div
          data-triangle-container
          style={{
          position: 'relative',
          height: '12px',
          marginBottom: '0.5rem',
          display: 'flex',
          alignItems: 'flex-start',
          width: 'calc(100% + 4rem)',
          marginLeft: '-2rem'
        }}>
          <div style={{
            flex: 1,
            height: '2px',
            background: '#525252',
            marginTop: '0px'
          }} />
          <div style={{
            position: 'absolute',
            left: `${trianglePosition}px`,
            transform: 'translateX(-50%) translateY(1px)',
            width: 0,
            height: 0,
            borderLeft: '14px solid transparent',
            borderRight: '14px solid transparent',
            borderTop: '17px solid #525252',
            marginTop: '0px',
            transition: 'left 0.3s ease'
          }}
          />
          <div style={{
            position: 'absolute',
            left: `${trianglePosition}px`,
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '12px solid transparent',
            borderRight: '12px solid transparent',
            borderTop: '15px solid #fafaf9',
            marginTop: '0px',
            transition: 'left 0.3s ease'
          }} />
        </div>

        {/* Menu Navigation */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          flexWrap: 'wrap',
          marginTop: '0.5rem',
          marginBottom: '0'
        }} data-category-container>
          {menuItems.map(item => (
            <Link
              key={item.id}
              href={item.href}
              ref={(el) => { categoryRefsRef.current[item.id] = el; }}
              style={{
                padding: '0.3rem 0.75rem',
                background: currentPage === item.id ? '#0a0a0a' : '#ffffff',
                color: currentPage === item.id ? '#ffffff' : '#0a0a0a',
                border: 'none',
                borderRadius: '0',
                fontSize: '0.65rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                letterSpacing: '0.05em',
                textDecoration: 'none',
                display: 'inline-block'
              }}
              onMouseOver={(e) => {
                if (currentPage !== item.id) {
                  e.currentTarget.style.background = '#f5f5f4';
                }
              }}
              onMouseOut={(e) => {
                if (currentPage !== item.id) {
                  e.currentTarget.style.background = '#ffffff';
                }
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
