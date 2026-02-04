'use client';

import React, { useState } from 'react';
import type { DetailedAnalysis, AnalyzedArticle } from '@/lib/schemas';

interface AnalysisDisplayProps {
  analysis: DetailedAnalysis;
}

const politicalOrientationColors: Record<string, string> = {
  skrajna_lewica: '#8B0000',
  lewica: '#DC143C',
  centrolewica: '#FF6B6B',
  centrum: '#808080',
  centroprawica: '#6B9DFF',
  prawica: '#0047AB',
  skrajna_prawica: '#00008B',
  neutralny: '#2E7D32'
};

const politicalOrientationLabels: Record<string, string> = {
  skrajna_lewica: 'Skrajna lewica',
  lewica: 'Lewica',
  centrolewica: 'Centrolewica',
  centrum: 'Centrum',
  centroprawica: 'Centroprawica',
  prawica: 'Prawica',
  skrajna_prawica: 'Skrajna prawica',
  neutralny: 'Neutralny'
};

export default function AnalysisDisplay({ analysis }: AnalysisDisplayProps) {
  const getNarrativeColor = (score: number): string => {
    if (score <= 15) return '#2E7D32';
    if (score <= 35) return '#7CB342';
    if (score <= 55) return '#B88900';
    if (score <= 75) return '#FB8C00';
    return '#D32F2F';
  };

  const getSourceOrientationKey = (sourceName: string) => {
    const normalized = sourceName.trim().toLowerCase();
    const matched = analysis.articles.find(article => article.source.trim().toLowerCase() === normalized);
    return matched?.political_orientation.category || 'neutralny';
  };

  const ArticleAnalysisItem = ({ article, index }: { article: AnalyzedArticle; index: number }) => {
    const [open, setOpen] = useState(false);

    return (
      <details
        style={{
          background: '#ffffff',
          padding: '1.25rem 0',
          marginBottom: '1.5rem',
          borderBottom: '1px solid #e6e6e6'
        }}
        onToggle={(event) => setOpen((event.currentTarget as HTMLDetailsElement).open)}
      >
        <summary style={{
          listStyle: 'none',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem'
        }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: '1rem'
        }}>
          <h3 style={{
            fontSize: '1.15rem',
            fontWeight: '700',
            margin: 0,
            color: '#0a0a0a'
          }}>
            {index + 1}. {article.title}
          </h3>
        </div>
        <div style={{
          fontSize: '0.8rem',
          color: '#444444'
        }}>
          <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ color: '#444444', textDecoration: 'underline' }}>
            Otwórz źródło: {article.source}
          </a>
        </div>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem 0.75rem',
          alignItems: 'center'
        }}>
          <span style={{
            display: 'inline-block',
            padding: '0.25rem 0.5rem',
            background: article.relevance.score === 'pełny' ? '#E8F5E9' : article.relevance.score === 'częściowy' ? '#FFF3E0' : '#FFEBEE',
            color: article.relevance.score === 'pełny' ? '#2E7D32' : article.relevance.score === 'częściowy' ? '#E65100' : '#C62828',
            fontSize: '0.7rem',
            fontWeight: '600',
            borderRadius: '3px'
          }}>
            {article.relevance.score === 'pełny' ? 'Pełne powiązanie' : article.relevance.score === 'częściowy' ? 'Częściowe powiązanie' : 'Brak powiązania'}
          </span>
          <span style={{
            fontSize: '0.8rem',
            color: '#444444'
          }}>
            Kreowanie narracji: <strong style={{ color: getNarrativeColor(article.narrative_creation_index.total_score) }}>{article.narrative_creation_index.total_score.toFixed(0)}%</strong>
          </span>
        </div>
        <div style={{
          fontSize: '0.9rem',
          color: '#0a0a0a',
          lineHeight: '1.55'
        }}>
          <strong>Wydarzenia:</strong> {article.summary.main_events}
        </div>
        <div style={{
          fontSize: '0.75rem',
          color: '#6b6b6b'
        }}>
          {open ? 'Kliknij, aby zwinąć analizę' : 'Kliknij, aby rozwinąć pełną analizę'}
          <span style={{ fontWeight: '700', marginLeft: '0.35rem' }}>{open ? '^' : 'v'}</span>
        </div>
      </summary>

      <div style={{ marginTop: '1.25rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.85rem', lineHeight: '1.5', color: '#0a0a0a' }}>
            <p style={{ marginBottom: '0.5rem' }}><strong>Uczestnicy:</strong> {article.summary.key_participants}</p>
            <p><strong>Wnioski:</strong> {article.summary.conclusions}</p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <div style={{
            padding: '0.75rem',
            background: '#f5f5f5',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#525252', marginBottom: '0.25rem' }}>
              ORIENTACJA POLITYCZNA
            </div>
            <div style={{
              fontSize: '0.9rem',
              fontWeight: '700',
              color: politicalOrientationColors[article.political_orientation.category] || '#525252',
              marginBottom: '0.25rem'
            }}>
              {politicalOrientationLabels[article.political_orientation.category] || article.political_orientation.category}
              {article.political_orientation.neutrality_bonus && ' ✓'}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#525252' }}>
              Pewność: {article.political_orientation.confidence}%
            </div>
          </div>

          <div style={{
            padding: '0.75rem',
            background: '#f5f5f5',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#525252', marginBottom: '0.25rem' }}>
              WSKAŹNIK NARRACJI
            </div>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: getNarrativeColor(article.narrative_creation_index.total_score),
              marginBottom: '0.25rem'
            }}>
              {article.narrative_creation_index.total_score.toFixed(0)}%
            </div>
            <div style={{ fontSize: '0.7rem', color: '#525252' }}>
              {article.narrative_creation_index.interpretation}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: '#525252' }}>
            Komponenty wskaźnika narracji:
          </h4>
          <div style={{ fontSize: '0.75rem', lineHeight: '1.6', color: '#0a0a0a' }}>
            <div>• Stronniczość: {article.narrative_creation_index.components.bias.score}% - {article.narrative_creation_index.components.bias.note}</div>
            <div>• Sensacyjność: {article.narrative_creation_index.components.sensationalism.score}% - {article.narrative_creation_index.components.sensationalism.note}</div>
            <div>• Odejście od faktów: {article.narrative_creation_index.components.fact_deviation.score}% - {article.narrative_creation_index.components.fact_deviation.note}</div>
          </div>
        </div>

        {article.manipulation_analysis.techniques_found > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: '#D32F2F' }}>
              Techniki manipulacji ({article.manipulation_analysis.techniques_found}):
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {article.manipulation_analysis.techniques.map((tech, idx) => (
                <div key={idx} style={{
                  padding: '0.75rem',
                  background: tech.severity === 'wysoka' ? '#FFEBEE' : tech.severity === 'średnia' ? '#FFF3E0' : '#F5F5F5',
                  border: `1px solid ${tech.severity === 'wysoka' ? '#EF5350' : tech.severity === 'średnia' ? '#FB8C00' : '#BDBDBD'}`
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.25rem', color: '#0a0a0a' }}>
                    {tech.id} - {tech.name} <span style={{
                      fontSize: '0.65rem',
                      padding: '0.15rem 0.4rem',
                      background: '#e0e0e0',
                      borderRadius: '3px',
                      marginLeft: '0.5rem'
                    }}>{tech.category}</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', fontStyle: 'italic', color: '#525252', marginBottom: '0.25rem' }}>
                    "{tech.quote}"
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#0a0a0a' }}>
                    {tech.explanation}
                  </div>
                  <div style={{ fontSize: '0.65rem', marginTop: '0.25rem', color: tech.severity === 'wysoka' ? '#D32F2F' : tech.severity === 'średnia' ? '#F57C00' : '#757575', fontWeight: '600' }}>
                    Dotkliwość: {tech.severity}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{
          padding: '0.75rem',
          background: '#f9f9f9',
          fontSize: '0.75rem',
          color: '#525252',
          borderTop: '1px solid #e0e0e0'
        }}>
          <strong>Ogólna ocena:</strong> {article.manipulation_analysis.overall_assessment}
        </div>

        {article.political_orientation.justification && (
          <div style={{
            padding: '0.75rem',
            background: '#f9f9f9',
            fontSize: '0.75rem',
            color: '#525252',
            borderTop: '1px solid #e0e0e0',
            marginTop: '0.5rem'
          }}>
            <strong>Uzasadnienie orientacji:</strong> {article.political_orientation.justification}
          </div>
        )}
      </div>
      </details>
    );
  };

  const renderArticleAnalysis = (article: AnalyzedArticle, index: number) => (
    <ArticleAnalysisItem key={article.id} article={article} index={index} />
  );

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '900',
        marginBottom: '1rem',
        color: '#0a0a0a'
      }}>
        Analiza źródeł:
      </h2>

      <div style={{
        background: '#ffffff',
        marginBottom: '1.5rem',
      }}>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            padding: '1rem',
            background: '#f5f5f5',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#525252', marginBottom: '0.25rem' }}>
              ŚREDNI WSKAŹNIK NARRACJI
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: getNarrativeColor(analysis.aggregate_statistics.avg_narrative_index)
            }}>
              {analysis.aggregate_statistics.avg_narrative_index.toFixed(1)}%
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.75rem', color: '#525252' }}>
            Rozkład orientacji politycznej:
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '0.5rem'
          }}>
            {Object.entries(analysis.aggregate_statistics.political_distribution).map(([key, value]) => (
              value > 0 && (
                <div key={key} style={{
                  padding: '0.5rem',
                  background: politicalOrientationColors[key] || '#e0e0e0',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  {politicalOrientationLabels[key] || key}: {value}
                </div>
              )
            ))}
          </div>
        </div>

        {analysis.aggregate_statistics.most_common_techniques.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.75rem', color: '#525252' }}>
              Najczęstsze techniki manipulacji:
            </h4>
            <div style={{ fontSize: '0.8rem', lineHeight: '1.6' }}>
              {analysis.aggregate_statistics.most_common_techniques.map((tech, idx) => (
                <div key={idx}>
                  {idx + 1}. {tech.name} - użyto {tech.count} razy
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.75rem', color: '#525252' }}>
            Ranking źródeł:
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {analysis.aggregate_statistics.sources_reliability_ranking.map((source, idx) => (
              <div key={idx} style={{
                padding: '0.75rem',
                background: '#f5f5f5',
                border: '1px solid #e0e0e0',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '0.6rem',
                flexWrap: 'wrap'
              }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>
                  {idx + 1}. {source.source}
                </span>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.75rem' }}>
                  <span style={{ color: getNarrativeColor(source.avg_narrative_index) }}>
                    Narracja: {source.avg_narrative_index.toFixed(1)}%
                  </span>
                  <span style={{
                    padding: '0.2rem 0.45rem',
                    background: politicalOrientationColors[getSourceOrientationKey(source.source)] || '#e0e0e0',
                    color: '#ffffff',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    borderRadius: '999px'
                  }}>
                    {politicalOrientationLabels[getSourceOrientationKey(source.source)] || getSourceOrientationKey(source.source)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* {analysis.excluded_articles.length > 0 && (
        <div style={{
          background: '#FFF3E0',
          border: '1.5px solid #FB8C00',
          padding: '1rem',
          marginBottom: '1.5rem',
          fontSize: '0.85rem'
        }}>
          <strong>Pominięte artykuły ({analysis.excluded_articles.length}):</strong>
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            {analysis.excluded_articles.map(ex => (
              <li key={ex.id}>{ex.title} - {ex.reason}</li>
            ))}
          </ul>
        </div>
      )} */}

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '900',
          marginBottom: '1rem',
          color: '#0a0a0a'
        }}>
          Źródła:
        </h2>
        {analysis.articles.map((article, index) => renderArticleAnalysis(article, index))}
      </div>
    </div>
  );
}
