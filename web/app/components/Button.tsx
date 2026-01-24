'use client';

import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'outline' | 'solid';
  icon?: LucideIcon;
  iconSize?: number;
  iconStrokeWidth?: number;
  fullWidth?: boolean;
}

export default function Button({
  children,
  href,
  onClick,
  variant = 'outline',
  icon: Icon,
  iconSize = 14,
  iconStrokeWidth = 2,
  fullWidth = false
}: ButtonProps) {
  const baseStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    fontSize: '0.75rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    letterSpacing: '0.02em',
    textDecoration: 'none',
    width: fullWidth ? '100%' : 'auto',
    justifyContent: 'center'
  };

  const variantStyles = {
    outline: {
      background: 'transparent',
      border: '1px solid #525252',
      color: '#525252'
    },
    solid: {
      background: '#0a0a0a',
      border: '1px solid #0a0a0a',
      color: '#ffffff'
    }
  };

  const hoverStyles = {
    outline: {
      background: '#0a0a0a',
      borderColor: '#0a0a0a',
      color: '#ffffff'
    },
    solid: {
      background: '#525252',
      borderColor: '#525252',
      color: '#ffffff'
    }
  };

  const [isHovered, setIsHovered] = React.useState(false);

  const currentStyles = {
    ...baseStyles,
    ...(isHovered ? hoverStyles[variant] : variantStyles[variant])
  };

  const content = (
    <>
      {children}
      {Icon && <Icon size={iconSize} strokeWidth={iconStrokeWidth} />}
    </>
  );

  const commonProps = {
    style: currentStyles,
    onMouseOver: () => setIsHovered(true),
    onMouseOut: () => setIsHovered(false)
  };

  if (href) {
    return (
      <Link href={href} {...commonProps}>
        {content}
      </Link>
    );
  }

  return (
    <button {...commonProps} onClick={onClick}>
      {content}
    </button>
  );
}
