'use client';

import React, { useState } from 'react';
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
  const [selectedCategory, setSelectedCategory] = useState('Wszystkie');
  const [trianglePosition, setTrianglePosition] = useState(0);
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const categoryRefsRef = React.useRef<Record<string, HTMLButtonElement | null>>({});

  const categories = ['Wszystkie', ...new Set(SAMPLE_STORIES.map(story => story.category))];
  const filteredStories = selectedCategory === 'Wszystkie'
    ? SAMPLE_STORIES
    : SAMPLE_STORIES.filter(story => story.category === selectedCategory);

  const menuItems = [
    { id: 'home', label: 'Wiadomości' },
    { id: 'trending', label: 'Na czasie' },
    { id: 'about', label: 'O nas' }
  ];

  const updateTrianglePosition = React.useCallback(() => {
    const currentItem = selectedMenu === null ? 'home' : selectedMenu;
    if (categoryRefsRef.current[currentItem]) {
      const buttonRect = categoryRefsRef.current[currentItem]!.getBoundingClientRect();
      const triangleContainer = document.querySelector('[data-triangle-container]');
      if (triangleContainer) {
        const triangleRect = triangleContainer.getBoundingClientRect();
        // Calculate button center relative to triangle container
        const position = buttonRect.left - triangleRect.left + buttonRect.width / 2;
        setTrianglePosition(position);
      }
    }
  }, [selectedMenu]);

  React.useEffect(() => {
    updateTrianglePosition();
    window.addEventListener('resize', updateTrianglePosition);
    return () => window.removeEventListener('resize', updateTrianglePosition);
  }, [updateTrianglePosition]);

  React.useEffect(() => {
    // Ensure position is updated after initial render
    const timer = setTimeout(updateTrianglePosition, 100);
    return () => clearTimeout(timer);
  }, [updateTrianglePosition]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fafaf9',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: '#0a0a0a',
      overflowX: 'hidden'
    }}>
      {/* Header */}
      <header style={{
        background: '#ffffff',
        borderBottom: '2px solid #525252',
        padding: '0.75rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.25rem' }}>
            <h1 style={{
              fontSize: '1.25rem',
              fontWeight: '900',
              margin: 0,
              color: '#0a0a0a',
              letterSpacing: '-0.02em'
            }}>
              OBIEKTYW
            </h1>
          </div>
          <p style={{
            margin: '0 0 0.5rem 0',
            color: '#0a0a0a',
            fontSize: '0.85rem',
            fontWeight: '500'
          }}>
            Analiza polskich mediów i technik manipulacji
          </p>

          {/* Top divider line */}
          <div style={{
            height: '2px',
            background: '#525252',
            marginBottom: '0.5rem',
            width: 'calc(100% + 4rem)',
            marginLeft: '-2rem'
          }} />

          {/* Knurled pattern - vertical lines */}
          <div style={{
            height: '8px',
            marginBottom: '0.5rem',
            width: 'calc(200% + 4rem)',
            marginLeft: '-30%',
            display: 'flex',
            position: 'relative',
            transform: `translateX(${trianglePosition - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)}px)`,
            transition: 'transform 0.3s ease',
            overflow: 'hidden'
          }}>
            {Array.from({ length: 100 }).map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${i * 0.9}%`,
                  height: '100%',
                  width: '1px',
                  background: '#525252'
                }}
              />
            ))}
          </div>

          {/* Divider with triangle */}
          <div
            data-triangle-container
            style={{
            position: 'relative',
            height: '12px',
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            width: 'calc(100% + 4rem)',
            marginLeft: '-2rem'
          }}>
            <div style={{
              flex: 1,
              height: '2px',
              background: '#525252',
              marginTop: '0px'
            }} />
            <div style={{
              position: 'absolute',
              left: `${trianglePosition}px`,
              transform: 'translateX(-50%) translateY(1px)',
              width: 0,
              height: 0,
              borderLeft: '14px solid transparent',
              borderRight: '14px solid transparent',
              borderTop: '17px solid #525252',
              marginTop: '0px',
              transition: 'left 0.3s ease'
            }}
            />
            <div style={{
              position: 'absolute',
              left: `${trianglePosition}px`,
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '12px solid transparent',
              borderRight: '12px solid transparent',
              borderTop: '15px solid #fafaf9',
              marginTop: '0px',
              transition: 'left 0.3s ease'
            }} />
          </div>

          {/* Menu Selection */}
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            flexWrap: 'wrap',
            marginTop: '0.5rem',
            marginBottom: '0'
          }} data-category-container>
            {menuItems.map(item => (
              <button
                key={item.id}
                ref={(el) => { categoryRefsRef.current[item.id] = el; }}
                onClick={() => item.id === 'home' ? setSelectedMenu(null) : setSelectedMenu(item.id)}
                style={{
                  padding: '0.3rem 0.75rem',
                  background: (item.id === 'home' && selectedMenu === null) || selectedMenu === item.id ? '#0a0a0a' : '#ffffff',
                  color: (item.id === 'home' && selectedMenu === null) || selectedMenu === item.id ? '#ffffff' : '#0a0a0a',
                  border: 'none',
                  borderRadius: '0',
                  fontSize: '0.65rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.05em'
                }}
                onMouseOver={(e) => {
                  if (((item.id === 'home' && selectedMenu !== null) || (item.id !== 'home' && selectedMenu !== item.id))) {
                    e.currentTarget.style.background = '#f5f5f4';
                  }
                }}
                onMouseOut={(e) => {
                  if (((item.id === 'home' && selectedMenu !== null) || (item.id !== 'home' && selectedMenu !== item.id))) {
                    e.currentTarget.style.background = '#ffffff';
                  }
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* Menu Content */}
        {selectedMenu === 'trending' && (
          <div style={{
            background: '#ffffff',
            border: '2px solid #525252',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '900', marginBottom: '1rem', color: '#0a0a0a' }}>
              Na czasie
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#525252', lineHeight: '1.6' }}>
              Tutaj pojawią się najpopularniejsze i najgorętsze tematy analizowane przez nasze media w ostatnich dniach.
            </p>
          </div>
        )}

        {selectedMenu === 'about' && (
          <>
            <div style={{
              background: '#ffffff',
              border: '2px solid #525252',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '900', marginBottom: '1rem', color: '#0a0a0a' }}>
                O OBIEKTYWIE
              </h2>
              <p style={{ fontSize: '0.95rem', color: '#525252', lineHeight: '1.6', marginBottom: '1rem' }}>
                Platforma agregująca polskie media i analizująca je pod kątem stronniczości oraz technik manipulacji.
                Wykorzystujemy AI do identyfikacji emocjonalnego języka, selektywnych faktów, pytań retorycznych
                i innych technik perswazji. Naszym celem jest pomoc w świadomym odbiorze informacji.
              </p>
            </div>

            <div style={{
              background: '#ffffff',
              border: '2px solid #525252',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '900', marginBottom: '1rem', color: '#0a0a0a' }}>
                Kontakt
              </h2>
              <p style={{ fontSize: '0.95rem', color: '#525252', lineHeight: '1.6', marginBottom: '1rem' }}>
                Chcesz się skontaktować z nami? Masz uwagi lub sugestie dotyczące OBIEKTYWU?
              </p>
              <p style={{ fontSize: '0.95rem', color: '#525252', lineHeight: '1.6', marginBottom: '1rem' }}>
                Email: <strong>info@obiektyw.media</strong>
              </p>
              <p style={{ fontSize: '0.95rem', color: '#525252', lineHeight: '1.6' }}>
                Obserwuj nas na mediach społecznościowych, aby być na bieżąco z najnowszymi analizami.
              </p>
            </div>
          </>
        )}

        {selectedMenu === null && (
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
        )}
      </main>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
