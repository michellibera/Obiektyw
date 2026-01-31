'use client';

import { Badge, Text } from '../atoms';

interface NewsHeaderProps {
  category: string;
  date: Date | string;
  source?: string;
  sourceUrl?: string;
}

export function NewsHeader({
  category,
  date,
  source,
  sourceUrl
}: NewsHeaderProps) {
  const dateStr = typeof date === 'string'
    ? new Date(date).toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    : date.toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '0.75rem',
        flexWrap: 'wrap'
      }}
    >
      <Badge variant="category">{category}</Badge>
      <Text variant="date">{dateStr}</Text>
      {source && (
        sourceUrl ? (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#0a0a0a',
              textDecoration: 'none',
              borderBottom: '1px solid #0a0a0a'
            }}
          >
            <Text variant="source">Źródło: {source}</Text>
          </a>
        ) : (
          <Text variant="source">Źródło: {source}</Text>
        )
      )}
    </div>
  );
}
