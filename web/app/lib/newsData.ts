export type Bias = 'left' | 'center' | 'right';

export interface Article {
  source: string;
  bias: Bias;
  headline: string;
  snippet: string;
  manipulationScore: number;
}

export interface Story {
  id: number;
  title: string;
  category: string;
  categoryColor: string;
  date: string;
  coverage: { left: number; center: number; right: number };
  blindSpots: string[];
  articles: Article[];
  enhancedQuery?: string;      // Claude-generated search query
  originalSnippets?: string[]; // Store extra_snippets for later use
  summary?: string;            // AI-generated summary
  summaryGeneratedAt?: string; // Timestamp for cache invalidation
}

export const SAMPLE_STORIES: Story[] = [
  {
    id: 1,
    title: 'Rząd zapowiada reformę systemu ochrony zdrowia',
    category: 'Polityka',
    categoryColor: '#dc2626',
    date: '2024-01-10',
    coverage: { left: 8, center: 12, right: 6 },
    blindSpots: [],
    articles: [
      {
        source: 'Gazeta Wyborcza',
        bias: 'left',
        headline: 'Przełom w służbie zdrowia: rząd przedstawia ambitny plan reform',
        snippet: 'Ministerstwo Zdrowia ogłosiło dziś kompleksowy plan modernizacji systemu ochrony zdrowia. Eksperci chwalą odważne propozycje, które mogą zakończyć lata zaniedbań w sektorze.',
        manipulationScore: 0.6
      },
      {
        source: 'TVN24',
        bias: 'center',
        headline: 'Rząd przedstawił plan reform służby zdrowia',
        snippet: 'Ministerstwo Zdrowia zaprezentowało propozycje zmian w systemie ochrony zdrowia. Plan zakłada zwiększenie nakładów oraz reorganizację szpitali. Opozycja zgłasza wątpliwości.',
        manipulationScore: 0.2
      },
      {
        source: 'Do Rzeczy',
        bias: 'right',
        headline: 'Kolejne chaos w służbie zdrowia? Rząd chce zniszczyć dotychczasowy system',
        snippet: 'Tak zwana "reforma" to w rzeczywistości próba całkowitego podporządkowania służby zdrowia interesom politycznym. Lekarze alarmują przed katastrofą.',
        manipulationScore: 0.8
      }
    ]
  },
  {
    id: 2,
    title: 'Polska gospodarka: wzrost PKB powyżej prognoz',
    category: 'Gospodarka',
    categoryColor: '#16a34a',
    date: '2024-01-09',
    coverage: { left: 5, center: 10, right: 9 },
    blindSpots: [],
    articles: [
      {
        source: 'Onet',
        bias: 'center',
        headline: 'PKB Polski wzrósł o 3.2% - powyżej oczekiwań analityków',
        snippet: 'Główny Urząd Statystyczny podał dane o wzroście gospodarczym za ostatni kwartał. Wzrost o 3.2% okazał się wyższy niż przewidywała większość ekonomistów.',
        manipulationScore: 0.1
      },
      {
        source: 'OKO.press',
        bias: 'left',
        headline: 'Wzrost gospodarczy, ale koszty życia w górę',
        snippet: 'Mimo wzrostu PKB, obywatele odczuwają rosnące koszty życia. Czy sukces gospodarczy przekłada się na lepszą jakość życia Polaków?',
        manipulationScore: 0.5
      },
      {
        source: 'wPolityce',
        bias: 'right',
        headline: 'Polski cud gospodarczy trwa! Lewica próbuje umniejszać sukces',
        snippet: 'Fantastyczne wyniki polskiej gospodarki to zasługa konsekwentnej polityki. Niestety opozycja zamiast cieszyć się z sukcesu, szuka dziury w całym.',
        manipulationScore: 0.9
      }
    ]
  }
];

export const POLISH_MEDIA = {
  left: [
    { name: 'Gazeta Wyborcza', bias: -2, credibility: 'wysoka' },
    { name: 'OKO.press', bias: -2.5, credibility: 'średnia' },
    { name: 'Newsweek Polska', bias: -1.5, credibility: 'wysoka' }
  ],
  center: [
    { name: 'TVN24', bias: -0.5, credibility: 'wysoka' },
    { name: 'Onet', bias: 0, credibility: 'średnia' },
    { name: 'Interia', bias: 0.5, credibility: 'średnia' }
  ],
  right: [
    { name: 'Do Rzeczy', bias: 2, credibility: 'średnia' },
    { name: 'wPolityce', bias: 2.5, credibility: 'niska' },
    { name: 'Gazeta Polska', bias: 3, credibility: 'niska' }
  ]
};

export const MANIPULATION_TECHNIQUES: Record<string, { name: string }> = {
  emotionalLanguage: { name: 'Język emocjonalny' },
  loadedTerms: { name: 'Nacechowane określenia' },
  selectiveFacts: { name: 'Selektywne fakty' },
  falseEquivalence: { name: 'Fałszywa równoważność' },
  strawman: { name: 'Chochołowanie' },
  adhominem: { name: 'Ad hominem' },
  appeal: { name: 'Odwołanie do emocji' },
  generalization: { name: 'Nadmierne uogólnianie' },
  rhetoric: { name: 'Pytania retoryczne' },
  polarization: { name: 'Polaryzacja' }
};
