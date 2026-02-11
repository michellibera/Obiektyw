'use client';

import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { MainLayout } from './templates';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <MainLayout>{children}</MainLayout>
    </ErrorBoundary>
  );
}
