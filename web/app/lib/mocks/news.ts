/**
 * Mock data for Brave News Search API
 * Used when USE_MOCK_NEWS feature flag is enabled
 */

import type { BraveSearchResult } from '../types/brave';

/**
 * Mock news articles matching Brave API schema
 */
export const mockNewsResults: BraveSearchResult[] = [
  {
    title: 'Nowe technologie AI revolucjonizują polskie firmy',
    url: 'https://example.com/news/ai-w-polsce',
    description: 'Sztuczna inteligencja zmienia sposób działania przedsiębiorstw w Polsce. Coraz więcej firm inwestuje w rozwiązania oparte o AI, co przekłada się na zwiększenie efektywności i konkurencyjności na rynku międzynarodowym.',
    age: '2 hours ago',
    subtype: 'article',
    profile: {
      name: 'Tech Poland',
      url: 'https://example.com/tech-poland'
    }
  },
  {
    title: 'Przełom w energetyce odnawialnej - nowe farmy wiatrowe na Bałtyku',
    url: 'https://example.com/news/farmy-wiatrowe',
    description: 'Rząd ogłosił plan budowy największych farm wiatrowych na polskich wodach terytorialnych Morza Bałtyckiego. Inwestycja ma pomóc w osiągnięciu celów klimatycznych i uniezależnić kraj od importu energii.',
    age: '5 hours ago',
    subtype: 'article',
    profile: {
      name: 'Energia Today',
      url: 'https://example.com/energia-today'
    }
  }
];
