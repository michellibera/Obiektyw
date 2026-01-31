'use client';

interface TextProps {
  children: React.ReactNode;
  variant?: 'label' | 'date' | 'source' | 'body';
  className?: string;
  style?: React.CSSProperties;
}

export function Text({
  children,
  variant = 'body',
  className = '',
  style = {}
}: TextProps) {
  const styles = {
    label: {
      fontSize: '0.65rem',
      color: '#525252',
      fontWeight: '600',
      ...style
    },
    date: {
      fontSize: '0.65rem',
      color: '#525252',
      fontWeight: '600',
      ...style
    },
    source: {
      fontSize: '0.65rem',
      color: '#525252',
      fontWeight: '700',
      ...style
    },
    body: {
      fontSize: '0.95rem',
      color: '#0a0a0a',
      lineHeight: '1.6',
      ...style
    }
  };

  return (
    <span style={styles[variant]} className={className}>
      {children}
    </span>
  );
}
