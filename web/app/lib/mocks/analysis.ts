/**
 * Mock data for LLM detailed analysis response
 * Used when USE_MOCK_ANALYSIS feature flag is enabled
 */

import type { DetailedAnalysis } from '../schemas/summarizeNews';

export const mockDetailedAnalysis: DetailedAnalysis = {
  search_phrase: 'transformacja energetyczna w Polsce',
  analysis_date: '2026-02-04T10:15:00.000Z',
  total_articles: 3,
  analyzed_articles: 2,
  excluded_articles: [
    {
      id: 'article_3',
      title: 'Rynek nieruchomosci zwalnia po serii podwyzek stop',
      reason: 'Brak bezposredniego zwiazku z tematem transformacji energetycznej'
    }
  ],
  articles: [
    {
      id: 'article_1',
      title: 'Nowe farmy wiatrowe na Baltyku przyspieszaja zielona energie',
      source: 'energiatoday.pl',
      url: 'https://example.com/news/farmy-wiatrowe',
      date: '2026-02-04T08:30:00.000Z',
      relevance: {
        score: 'pełny',
        note: 'Artykul bezposrednio opisuje kluczowy projekt OZE'
      },
      summary: {
        main_events: 'ogloszenie przetargu, start inwestycji, deklaracje MKiS',
        key_participants: ['MKiS', 'PSE', 'konsorcja offshore'],
        conclusions: 'Inwestycja ma zwiekszyc bezpieczenstwo energetyczne i udzial OZE. Harmonogram pozostaje ambitny, ale finansowanie jest zabezpieczone.'
      },
      political_orientation: {
        category: 'neutralny',
        confidence: 78,
        justification: 'Material opisuje fakty i wypowiedzi kilku stron bez oceniajacego jezyka.',
        neutrality_bonus: true
      },
      narrative_creation_index: {
        total_score: 18,
        components: {
          bias: { score: 12, weight: 0.4, note: 'Niewielka przewaga cytatow strony rzadowej' },
          sensationalism: { score: 10, weight: 0.3, note: 'Stonowane naglowki i brak hiperbol' },
          fact_deviation: { score: 32, weight: 0.3, note: 'Komentarze ograniczone, przewaga faktow' }
        },
        interpretation: 'Rzetelny material informacyjny'
      },
      manipulation_analysis: {
        techniques_found: 1,
        techniques: [
          {
            id: 'T01',
            name: 'Framing',
            category: 'narracyjna',
            quote: 'To historyczna szansa na niezaleznosc energetyczna.',
            explanation: 'Kadrowanie wydarzenia jako przelomowego moze wzmacniac pozytywny odbior decyzji.',
            severity: 'niska'
          }
        ],
        overall_assessment: 'Niewielkie elementy narracyjne, bez wyraznej manipulacji.'
      },
      metadata: {
        word_count: 612,
        analysis_notes: 'Ton neutralny, uwzglednione glosy ekspertow.'
      }
    },
    {
      id: 'article_2',
      title: 'Program doplat do termomodernizacji budzi spory w samorzadach',
      source: 'politykaregion.pl',
      url: 'https://example.com/news/termomodernizacja',
      date: '2026-02-04T07:10:00.000Z',
      relevance: {
        score: 'częściowy',
        note: 'Artykul dotyczy polityki energetycznej, ale skupia sie na sporach proceduralnych.'
      },
      summary: {
        main_events: 'kryteria naboru, spory o finansowanie, glosy samorzadow',
        key_participants: ['samorzady', 'NFOs', 'ministerstwo'],
        conclusions: 'Program ma poparcie co do celu, ale budzi obawy o tempo i podzial srodkow. Potrzebne sa jasniejsze wytyczne.'
      },
      political_orientation: {
        category: 'centroprawica',
        confidence: 61,
        justification: 'Akcentuje krytyke biurokracji i akcenty na efektywnosc wydatkow.',
        neutrality_bonus: false
      },
      narrative_creation_index: {
        total_score: 44,
        components: {
          bias: { score: 48, weight: 0.4, note: 'Widoczna przewaga stanowisk krytycznych wobec programu' },
          sensationalism: { score: 35, weight: 0.3, note: 'Umiarkowanie emocjonalne sformulowania' },
          fact_deviation: { score: 42, weight: 0.3, note: 'Zauwazalny udzial opinii w komentarzach' }
        },
        interpretation: 'Lekkie kreowanie narracji'
      },
      manipulation_analysis: {
        techniques_found: 2,
        techniques: [
          {
            id: 'T04',
            name: 'Sensacjonalizm',
            category: 'narracyjna',
            quote: 'Samorzady alarmuja: program wymyka sie spod kontroli.',
            explanation: 'Podkreslanie alarmistycznego tonu wzmacnia poczucie kryzysu.',
            severity: 'średnia'
          },
          {
            id: 'T05',
            name: 'Loaded language',
            category: 'narracyjna',
            quote: 'Biurokratyczna machina marnuje srodki.',
            explanation: 'Uzycie nacechowanych slow ocenia uczestnikow sporu.',
            severity: 'średnia'
          }
        ],
        overall_assessment: 'Wyrazna narracja krytyczna, ale bez razacych przeklaman.'
      },
      metadata: {
        word_count: 758,
        analysis_notes: 'Podkresla konflikty instytucjonalne, mniej danych liczbowych.'
      }
    }
  ],
  aggregate_statistics: {
    avg_narrative_index: 31,
    political_distribution: {
      skrajna_lewica: 0,
      lewica: 0,
      centrolewica: 0,
      centrum: 0,
      centroprawica: 1,
      prawica: 0,
      skrajna_prawica: 0,
      neutralny: 1
    },
    most_common_techniques: [
      { id: 'T04', name: 'Sensacjonalizm', count: 1 },
      { id: 'T05', name: 'Loaded language', count: 1 },
      { id: 'T01', name: 'Framing', count: 1 }
    ],
    sources_reliability_ranking: [
      { source: 'energiatoday.pl', avg_narrative_index: 18, neutrality_score: 86 },
      { source: 'politykaregion.pl', avg_narrative_index: 44, neutrality_score: 52 }
    ]
  }
};

export const mockSummarizeNewsResult = {
  title: 'Transformacja energetyczna: offshore i termomodernizacja w praktyce',
  summary: 'Artykuly opisuja rozwijajace sie projekty OZE oraz dyskusje o termomodernizacji. Dominuje ton informacyjny, ale w tekscie o doplatach widoczne sa elementy krytycznej narracji. Wspolnym mianownikiem jest potrzeba przyspieszenia inwestycji oraz lepszej koordynacji finansowania.',
  analysis: mockDetailedAnalysis
};
