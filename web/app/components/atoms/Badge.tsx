'use client';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'source' | 'category';
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  className = ''
}: BadgeProps) {
  const styles = {
    default: {
      padding: '0.25rem 0.75rem',
      background: '#0a0a0a',
      borderRadius: '0',
      fontSize: '0.65rem',
      fontWeight: '700',
      color: '#ffffff',
      letterSpacing: '0.05em'
    },
    source: {
      padding: '0.25rem 0.75rem',
      background: 'transparent',
      borderRadius: '0',
      fontSize: '0.65rem',
      fontWeight: '700',
      color: '#525252'
    },
    category: {
      padding: '0.25rem 0.75rem',
      background: '#0a0a0a',
      borderRadius: '0',
      fontSize: '0.65rem',
      fontWeight: '700',
      color: '#ffffff',
      letterSpacing: '0.05em'
    }
  };

  return (
    <div style={styles[variant]} className={className}>
      {children}
    </div>
  );
}
