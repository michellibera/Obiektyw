'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Story } from '@/lib/newsData';

interface NewsContextType {
  selectedStory: Story | null;
  setSelectedStory: (story: Story | null) => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export function NewsProvider({ children }: { children: ReactNode }) {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  return (
    <NewsContext.Provider value={{ selectedStory, setSelectedStory }}>
      {children}
    </NewsContext.Provider>
  );
}

export function useNews() {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within NewsProvider');
  }
  return context;
}
