'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { DetailedAnalysis } from '@/lib/schemas';

const POLITICAL_LABELS: Record<string, { label: string; color: string }> = {
  'skrajna-lewica': { label: 'Skrajna lewica', color: '#9B1D20' },
  'lewica': { label: 'Lewica', color: '#C23B3B' },
  'centrolewica': { label: 'Centrolewica', color: '#D4845A' },
  'centrum': { label: 'Centrum', color: '#7A7A7A' },
  'centroprawica': { label: 'Centroprawica', color: '#5B8FB9' },
  'prawica': { label: 'Prawica', color: '#2E5A9E' },
  'skrajna-prawica': { label: 'Skrajna prawica', color: '#1B2A4A' },
  'neutralny': { label: 'Neutralny', color: '#888' },
};

const MANIPULATION_TECHNIQUES: Record<string, { namepl: string; category: string }> = {
  T01: { namepl: 'Kadrowanie', category: 'narracyjna' },
  T02: { namepl: 'Wybiorcze fakty', category: 'narracyjna' },
  T03: { namepl: 'Pominiecie', category: 'narracyjna' },
  T04: { namepl: 'Sensacjonalizm', category: 'narracyjna' },
  T05: { namepl: 'Nacechowany jezyk', category: 'narracyjna' },
  T06: { namepl: 'Falszywa rownowaga', category: 'narracyjna' },
  T07: { namepl: 'Whataboutism', category: 'narracyjna' },
  T08: { namepl: 'Atak personalny', category: 'atak' },
  T09: { namepl: 'Chochol', category: 'atak' },
  T10: { namepl: 'Wina przez skojarzenie', category: 'atak' },
  T11: { namepl: 'Etykietowanie', category: 'atak' },
  T12: { namepl: 'Apel do strachu', category: 'emocjonalna' },
  T13: { namepl: 'Apel do oburzenia', category: 'emocjonalna' },
  T14: { namepl: 'Apel do wspolczucia', category: 'emocjonalna' },
  T15: { namepl: 'Apel do dumy/wstydu', category: 'emocjonalna' },
  L01: { namepl: 'Falszywa dychotomia', category: 'blad logiczny' },
  L02: { namepl: 'Rownia pochyla', category: 'blad logiczny' },
  L03: { namepl: 'Blad przyczynowy', category: 'blad logiczny' },
  L04: { namepl: 'Pochopne uogolnienie', category: 'blad logiczny' },
  L05: { namepl: 'Bledne kolo', category: 'blad logiczny' },
  L06: { namepl: 'Autorytet', category: 'blad logiczny' },
  L07: { namepl: 'Owczy ped', category: 'blad logiczny' },
  L08: { namepl: 'Nie wynika', category: 'blad logiczny' },
};

const TECH_CAT_COLORS: Record<string, string> = {
  narracyjna: '#B08030',
  atak: '#A83A3A',
  emocjonalna: '#7B3FA0',
  'blad logiczny': '#2A7B6F',
};

function getNarrativeColor(value: number) {
  if (value <= 15) return '#1A7A3A';
  if (value <= 35) return '#6A8A20';
  if (value <= 55) return '#A08018';
  if (value <= 75) return '#B85A1A';
  return '#A02020';
}

function getNarrativeLabel(value: number) {
  if (value <= 15) return 'rzetelne dziennikarstwo';
  if (value <= 35) return 'lekkie nachylenie';
  if (value <= 55) return 'kreowanie narracji';
  if (value <= 75) return 'wyrazna manipulacja';
  return 'propaganda';
}

function NarrativeBar({ value, compact }: { value: number; compact?: boolean }) {
  const color = getNarrativeColor(value);
  const label = getNarrativeLabel(value);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? '3px' : '5px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
        <span style={{ fontSize: compact ? '22px' : '32px', fontWeight: 700, fontFamily: 'var(--font-archivo)', color, lineHeight: 1 }}>{value}</span>
        <span style={{ fontSize: '12px', color: 'var(--muted)' }}>/ 100</span>
      </div>
      <span style={{ fontSize: '11px', fontWeight: 600, color, textTransform: 'uppercase', letterSpacing: '0.8px' }}>{label}</span>
      <div style={{ width: '100%', height: '2px', background: 'var(--border)', borderRadius: '1px' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: '1px', transition: 'width 0.6s ease' }} />
      </div>
    </div>
  );
}

function SeverityDot({ severity }: { severity: string }) {
  const normalized = severity.toLowerCase();
  const c = normalized === 'wysoka' ? '#A02020' : normalized === 'srednia' ? '#A08018' : '#1A7A3A';
  return <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: c, flexShrink: 0 }} />;
}

function normalizeOrientation(value: string) {
  return value.replace('_', '-');
}

function splitList(value: string | string[] | undefined | null): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(v => v.trim()).filter(Boolean);
  return value
    .split(',')
    .map(v => v.trim())
    .filter(Boolean);
}

interface TopicDetailResponse {
  success: boolean;
  error?: string;
  topic?: {
    id: string;
    objectiveTitle: string;
    summary: string;
    analysis: DetailedAnalysis | null;
  };
}

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [generatedTitle, setGeneratedTitle] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<DetailedAnalysis | null>(null);
  const [expandedArticle, setExpandedArticle] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          throw new Error('Brak identyfikatora newsa');
        }

        const response = await fetch(`/api/topics/${encodeURIComponent(id)}`);
        const data: TopicDetailResponse = await response.json();

        if (!data.success || !data.topic) {
          throw new Error(data.error || 'Failed to fetch topic');
        }

        setGeneratedTitle(data.topic.objectiveTitle || '');
        setSummary(data.topic.summary || '');
        setAnalysis(data.topic.analysis || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching news details:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const mappedAnalysis = useMemo(() => {
    if (!analysis) return null;

    const articles = analysis.articles.map(article => {
      const orientationKey = normalizeOrientation(article.political_orientation.category);
      return {
        title: article.title,
        source: article.source,
        politicalOrientation: orientationKey,
        politicalConfidence: article.political_orientation.confidence,
        politicalJustification: article.political_orientation.justification,
        neutralityBonus: article.political_orientation.neutrality_bonus,
        narrativeIndex: Math.round(article.narrative_creation_index.total_score),
        biasComponent: Math.round(article.narrative_creation_index.components.bias.score),
        sensationalismComponent: Math.round(article.narrative_creation_index.components.sensationalism.score),
        factDeviationComponent: Math.round(article.narrative_creation_index.components.fact_deviation.score),
        summary: {
          events: splitList(article.summary.main_events),
          participants: splitList(article.summary.key_participants as unknown as string | string[]),
          conclusions: article.summary.conclusions,
        },
        techniques: article.manipulation_analysis.techniques.map(tech => ({
          id: tech.id,
          quote: tech.quote,
          explanation: tech.explanation,
          severity: tech.severity.replace('średnia', 'srednia'),
        })),
        overallAssessment: article.manipulation_analysis.overall_assessment,
      };
    });

    const avgNarrative = Math.round(analysis.aggregate_statistics.avg_narrative_index);
    const orientationDistribution = analysis.aggregate_statistics.political_distribution;
    const topTechniques = analysis.aggregate_statistics.most_common_techniques
      .map(tech => [tech.id, tech.count] as [string, number])
      .slice(0, 6);
    const credibilityRanking = analysis.aggregate_statistics.sources_reliability_ranking
      .map(item => ({ source: item.source, narrativeIndex: Math.round(item.avg_narrative_index) }))
      .sort((a, b) => a.narrativeIndex - b.narrativeIndex);

    return {
      title: generatedTitle || '',
      summary: summary || '',
      avgNarrative,
      orientationDistribution,
      topTechniques,
      credibilityRanking,
      articles,
    };
  }, [analysis, generatedTitle, summary]);

  if (loading) {
    return (
      <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--muted)' }}>
        Ladowanie...
      </div>
    );
  }

  if (error || !mappedAnalysis) {
    return (
      <div style={{ padding: '2rem 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem' }}>
          {error || 'Nie znaleziono newsa'}
        </h1>
        <button
          onClick={() => router.push('/')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: '#0a0a0a',
            color: '#ffffff',
            border: 'none',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Powrot do strony glownej
        </button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '13px', marginBottom: '28px' }}>&larr; Wroc do listy</button>

      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '30px', fontWeight: 400, lineHeight: 1.3, marginBottom: '14px' }}>{mappedAnalysis.title}</h1>
      <p style={{ fontSize: '20px', lineHeight: 1.7, fontFamily: 'var(--font-serif)', marginBottom: '32px' }}>{mappedAnalysis.summary}</p>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', marginBottom: '28px' }}>
        <div style={{ marginBottom: '28px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '10px' }}>Sredni wskaznik narracji</span>
          <NarrativeBar value={mappedAnalysis.avgNarrative} />
        </div>

        <div style={{ height: '1px', background: 'var(--border)', margin: '0 0 24px' }} />

        <div style={{ marginBottom: '24px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '12px' }}>Orientacja polityczna zrodel</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {Object.entries(mappedAnalysis.orientationDistribution).map(([key, count]) => {
              const labelKey = normalizeOrientation(key);
              const info = POLITICAL_LABELS[labelKey];
              return info ? (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '110px', fontSize: '12px', textAlign: 'right' }}>{info.label}</span>
                  <div style={{ flex: 1, height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${(count / mappedAnalysis.articles.length) * 100}%`, height: '100%', background: info.color, borderRadius: '2px', transition: 'width 0.5s ease' }} />
                  </div>
                  <span style={{ fontSize: '12px', fontFamily: 'var(--font-archivo)', width: '16px' }}>{count}</span>
                </div>
              ) : null;
            })}
          </div>
        </div>

        <div style={{ height: '1px', background: 'var(--border)', margin: '0 0 24px' }} />

        <div style={{ marginBottom: '24px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '12px' }}>Najczestsze techniki</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {mappedAnalysis.topTechniques.map(([id, count]) => {
              const t = MANIPULATION_TECHNIQUES[id];
              if (!t) return null;
              return (
                <div key={id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: TECH_CAT_COLORS[t.category] }} />
                    <span style={{ fontSize: '13px', color: 'var(--fg)' }}>{t.namepl}</span>
                  </div>
                  <span style={{ fontSize: '12px', fontFamily: 'var(--font-archivo)' }}>{count}x</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ height: '1px', background: 'var(--border)', margin: '0 0 24px' }} />

        <div>
          <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '12px' }}>Ranking wiarygodnosci</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {mappedAnalysis.credibilityRanking.map((article, index) => (
              <div key={`${article.source}-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontFamily: 'var(--font-archivo)', fontSize: '11px', width: '18px' }}>{index + 1}.</span>
                <span style={{ fontSize: '13px', flex: 1 }}>{article.source}</span>
                <span style={{ fontFamily: 'var(--font-archivo)', fontSize: '13px', fontWeight: 500, color: getNarrativeColor(article.narrativeIndex) }}>{article.narrativeIndex}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

        <div style={{ borderTop: '2px solid var(--fg)', paddingTop: '24px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            Analizowane artykuly ({mappedAnalysis.articles.length})
          </span>
          <div style={{ marginTop: '16px' }}>
            {mappedAnalysis.articles.map((article, idx) => {
              const isExpanded = expandedArticle === idx;
              const pol = POLITICAL_LABELS[article.politicalOrientation];
              return (
                <div key={idx} style={{ borderBottom: '1px solid var(--border)', animation: `fadeUp 0.3s ease ${idx * 0.04}s both` }}>
                  <div
                    onClick={() => setExpandedArticle(isExpanded ? null : idx)}
                    style={{ padding: '18px 0', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', transition: 'background 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--hover)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '12px', fontFamily: 'var(--font-archivo)', color: 'var(--subtle)' }}>{article.source}</span>
                        <span style={{ fontSize: '10px', fontWeight: 600, color: pol?.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{pol?.label}</span>
                        {article.neutralityBonus && <span style={{ fontSize: '10px', fontWeight: 600, color: '#1A7A3A' }}>&#9733; Neutralny</span>}
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 400, lineHeight: 1.35 }}>{article.title}</h3>
                      <div style={{ textAlign: 'center', marginTop: '6px' }}>
                        <button
                          type="button"
                          onClick={() => setExpandedArticle(isExpanded ? null : idx)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '11px',
                            color: 'var(--muted)',
                            fontFamily: 'var(--font-archivo)',
                            letterSpacing: '0.4px',
                          }}
                        >
                          {isExpanded ? (
                            <>
                              <span>Zwiń</span>
                              <span style={{ marginLeft: '6px', display: 'inline-block', transform: 'rotate(-90deg)' }}>&rarr;</span>
                            </>
                          ) : (
                            <>
                              <span>Pokaż szczegóły</span>
                              <span style={{ marginLeft: '6px', display: 'inline-block', transform: 'rotate(90deg)' }}>&rarr;</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, marginTop: '6px' }}>
                      <span style={{ fontFamily: 'var(--font-archivo)', fontSize: '18px', fontWeight: 500, color: getNarrativeColor(article.narrativeIndex) }}>{article.narrativeIndex}</span>
                      <span style={{ color: 'var(--subtle)', fontSize: '12px', transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>&rarr;</span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ paddingBottom: '24px', animation: 'fadeIn 0.25s ease' }}>
                      <div style={{ paddingBottom: '20px', marginBottom: '20px', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.8px', display: 'block', marginBottom: '10px' }}>Wydarzenia:</span>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '18px' }}>
                          {article.summary.events.map((event, i) => (
                            <span key={i} style={{ background: 'var(--hover)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: '3px', fontSize: '11px' }}>{event}</span>
                          ))}
                        </div>
                        <p style={{ fontSize: '12px', marginBottom: '14px' }}>
                          <span style={{ fontWeight: 600, color: 'var(--fg)' }}>Uczestnicy: </span>{article.summary.participants.join(', ')}
                        </p>
                        <p style={{ fontSize: '12px', marginBottom: '6px' }}>
                          <span style={{ fontWeight: 600, color: 'var(--fg)' }}>Podsumowanie: </span>
                        </p>
                        <p style={{ fontSize: '16px', color: 'var(--fg)', lineHeight: 1.6, fontFamily: 'var(--font-serif)' }}>{article.summary.conclusions}</p>
                      </div>

                      <div style={{ paddingBottom: '20px', marginBottom: '20px', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '10px' }}>Wskaznik kreowania narracji</span>
                        <div style={{ marginBottom: '14px' }}><NarrativeBar value={article.narrativeIndex} compact /></div>
                        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                          {[['Stronniczosc', article.biasComponent, '40%'], ['Sensacyjnosc', article.sensationalismComponent, '30%'], ['Odejscie od faktow', article.factDeviationComponent, '30%']].map(([label, value, weight], i) => (
                            <div key={i} style={{ minWidth: '150px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{ fontSize: '11px' }}>{label}</span>
                                <span style={{ fontSize: '10px', fontFamily: 'var(--font-archivo)' }}>waga {weight}</span>
                              </div>
                              <span style={{ fontSize: '16px', fontFamily: 'var(--font-archivo)', fontWeight: 500, color: getNarrativeColor(value as number) }}>{value as number}</span>
                              <div style={{ width: '100%', height: '2px', background: 'var(--border)', borderRadius: '1px', marginTop: '3px' }}>
                                <div style={{ width: `${value}%`, height: '100%', background: getNarrativeColor(value as number), borderRadius: '1px' }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ paddingBottom: '20px', marginBottom: '20px', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '8px' }}>Orientacja polityczna</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: pol?.color }}>{pol?.label}</span>
                          <span style={{ fontSize: '11px', fontFamily: 'var(--font-archivo)' }}>pewnosc: {article.politicalConfidence}%</span>
                        </div>
                        <p style={{ fontSize: '13px', lineHeight: 1.6 }}>{article.politicalJustification}</p>
                      </div>

                      {article.techniques.length > 0 && (
                        <div style={{ paddingBottom: '20px', marginBottom: '20px', borderBottom: '1px solid var(--border)' }}>
                          <span style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '12px' }}>
                            Wykryte techniki manipulacji ({article.techniques.length})
                          </span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {article.techniques.map((tech, techIndex) => {
                              const info = MANIPULATION_TECHNIQUES[tech.id];
                              const catColor = info ? TECH_CAT_COLORS[info.category] : '#999';
                              return (
                                <div key={`${tech.id}-${techIndex}`} style={{ paddingLeft: '12px', borderLeft: `2px solid ${catColor}` }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{info?.namepl || tech.id}</span>
                                    <span style={{ fontSize: '10px', textTransform: 'uppercase' }}>{info?.category || 'inne'}</span>
                                    <SeverityDot severity={tech.severity} />
                                    <span style={{ fontSize: '10px' }}>{tech.severity}</span>
                                  </div>
                                  <p style={{ fontSize: '15px', fontFamily: 'var(--font-serif)', fontStyle: 'italic', lineHeight: 1.5, marginBottom: '4px' }}>
                                    {tech.quote}
                                  </p>
                                  <p style={{ fontSize: '14px', lineHeight: 1.5 }}>{tech.explanation}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div>
                        <span style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '6px' }}>Ocena ogolna</span>
                        <p style={{ fontSize: '14px', color: 'var(--fg)', lineHeight: 1.7 }}>{article.overallAssessment}</p>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '18px' }}>
                        <button
                          type="button"
                          onClick={() => setExpandedArticle(null)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '11px',
                            color: 'var(--muted)',
                            fontFamily: 'var(--font-archivo)',
                            letterSpacing: '0.4px',
                          }}
                        >
                          <span>zwin</span>
                          <span style={{ marginLeft: '6px', display: 'inline-block', transform: 'rotate(-90deg)' }}>&rarr;</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
    </div>
  );
}
