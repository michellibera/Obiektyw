'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

// Symulowane dane polskich mediów
const POLISH_MEDIA = {
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

const SAMPLE_STORIES = [
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

const MANIPULATION_TECHNIQUES: Record<string, { name: string }> = {
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

type Bias = 'left' | 'center' | 'right';

interface Article {
  source: string;
  bias: Bias;
  headline: string;
  snippet: string;
  manipulationScore: number;
}

interface AnalysisResult {
  overallScore: number;
  techniques: Array<{
    type: string;
    severity: number;
    example: string;
    explanation: string;
  }>;
  summary: string;
}

export default function ManipulationAnalyzer() {
  const filteredStories = SAMPLE_STORIES;

  return (
    <>
      {/* Stats Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
      </div>

      {/* Stories List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filteredStories.map(story => (
            <div
              key={story.id}
              style={{
                background: '#ffffff',
                border: '2px solid #525252',
                borderRadius: '0',
                overflow: 'hidden',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      marginBottom: '0.75rem'
                    }}>
                      <div style={{
                        padding: '0.25rem 0.75rem',
                        background: '#0a0a0a',
                        borderRadius: '0',
                        fontSize: '0.65rem',
                        fontWeight: '700',
                        color: '#ffffff',
                        letterSpacing: '0.05em'
                      }}>
                        {story.category}
                      </div>
                      <div style={{
                        fontSize: '0.65rem',
                        color: '#525252',
                        fontWeight: '600'
                      }}>
                        {new Date(story.date).toLocaleDateString('pl-PL', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                      </div>
                    </div>
                    <h2 style={{
                      fontSize: '1.1rem',
                      fontWeight: '900',
                      margin: '0 0 0.5rem 0',
                      color: '#0a0a0a',
                      letterSpacing: '-0.02em'
                    }}>
                      {story.title}
                    </h2>
                  </div>
                </div>

                {/* Coverage Bar */}
                <div style={{ marginBottom: '0.3rem' }}>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#525252',
                    marginBottom: '0.5rem',
                    fontWeight: '600'
                  }}>
                    Pokrycie medialne:
                  </div>
                  <div style={{
                    display: 'flex',
                    height: '16px',
                    borderRadius: '0',
                    overflow: 'hidden',
                    border: '1px solid #525252'
                  }}>
                    <div style={{
                      flex: story.coverage.left,
                      background: '#3b6fd1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '0.55rem',
                      borderRight: '1px solid #525252'
                    }}>
                      LEWICA {story.coverage.left}
                    </div>
                    <div style={{
                      flex: story.coverage.center,
                      background: '#6b4fa3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '0.55rem',
                      borderRight: '1px solid #525252'
                    }}>
                      CENTRUM {story.coverage.center}
                    </div>
                    <div style={{
                      flex: story.coverage.right,
                      background: '#c92f35',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '0.55rem'
                    }}>
                      PRAWICA {story.coverage.right}
                    </div>
                  </div>
                </div>
                </div>

                {/* Narrative Creation Bar */}
                <div style={{ marginBottom: '1rem', padding: '0 1rem' }}>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#525252',
                    marginBottom: '0.5rem',
                    fontWeight: '600'
                  }}>
                    Poziom kreowania narracji:
                  </div>
                  {(() => {
                    const narrativeLevel = Math.round(Math.random() * 100);
                    return (
                      <div style={{
                        display: 'flex',
                        height: '16px',
                        borderRadius: '0',
                        overflow: 'hidden',
                        border: '1px solid #525252'
                      }}>
                        <div style={{
                          width: `${narrativeLevel}%`,
                          background: '#0a0a0a',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          fontWeight: '700',
                          fontSize: '0.55rem',
                          transition: 'width 0.3s ease'
                        }}>
                          {narrativeLevel > 10 && `${narrativeLevel}%`}
                        </div>
                        <div style={{
                          flex: 1,
                          background: '#e5e5e5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: narrativeLevel <= 10 ? 'center' : 'flex-start',
                          color: '#0a0a0a',
                          fontWeight: '700',
                          fontSize: '0.55rem',
                          paddingLeft: narrativeLevel <= 10 ? '0' : '0.25rem'
                        }}>
                          {narrativeLevel <= 10 && `${narrativeLevel}%`}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Discrete button to view analysis */}
                <div style={{
                  padding: '1.5rem 1rem 1rem 1rem',
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  <button
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      background: 'transparent',
                      border: '1px solid #525252',
                      color: '#525252',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      letterSpacing: '0.02em'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#0a0a0a';
                      e.currentTarget.style.borderColor = '#0a0a0a';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = '#525252';
                      e.currentTarget.style.color = '#525252';
                    }}
                  >
                    Zobacz więcej
                    <ArrowRight size={14} strokeWidth={2} />
                  </button>
                </div>
            </div>
          ))}
      </div>
    </>
  );
}
