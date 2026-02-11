// Ten plik jest zachowany dla kompatybilności wstecznej
// Wszystkie schematy zostały przeniesione do app/lib/schemas/analysis/

export {
  // Główne schematy
  DetailedAnalysisResponseSchema,
  SummarizeNewsResponseSchema,
  SummarizeNewsSchema,
  ArticleInputSchema,

  // Schematy składowe
  AnalyzedArticleSchema,
  ExcludedArticleSchema,
  ManipulationTechniqueSchema,
  ManipulationAnalysisSchema,
  PoliticalOrientationSchema,
  RelevanceSchema,
  NarrativeIndexSchema,
  SummarySchema,
  MetadataSchema,
  AggregateStatisticsSchema,

  // Typy
  type DetailedAnalysis,
  type SummarizeNewsResponse,
  type SummarizeNewsInput,
  type ArticleInput,
  type AnalyzedArticle,
  type ManipulationTechnique,
  type ManipulationAnalysis,
  type PoliticalOrientation,
  type Relevance,
  type NarrativeIndex,
  type Summary,
  type Metadata,
  type AggregateStatistics,
  type ExcludedArticle,
} from './analysis';
