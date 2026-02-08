'use client';

import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import AppShell from './AppShell';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <AppShell>{children}</AppShell>
    </ErrorBoundary>
  );
}
