import { z } from 'zod';

export const ArticleSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  url: z.string().url()
});

export const SummarizeNewsSchema = z.object({
  articles: z.array(ArticleSchema).min(1, 'At least one article is required').max(50),
  searchPhrase: z.string().optional()
});

export type SummarizeNewsInput = z.infer<typeof SummarizeNewsSchema>;

// Szczegółowe schematy dla analizy
const ManipulationTechniqueSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(['narracyjna', 'atak', 'emocjonalna', 'błąd_logiczny']),
  quote: z.string(),
  explanation: z.string(),
  severity: z.enum(['niska', 'średnia', 'wysoka'])
});

const RelevanceSchema = z.object({
  score: z.enum(['pełny', 'częściowy', 'brak']),
  note: z.string().optional()
});

const PoliticalOrientationSchema = z.object({
  category: z.enum([
    'skrajna_lewica',
    'lewica',
    'centrolewica',
    'centrum',
    'centroprawica',
    'prawica',
    'skrajna_prawica',
    'neutralny'
  ]),
  confidence: z.number().min(0).max(100),
  justification: z.string(),
  neutrality_bonus: z.boolean()
});

const NarrativeIndexSchema = z.object({
  total_score: z.number().min(0).max(100),
  components: z.object({
    bias: z.object({
      score: z.number().min(0).max(100),
      weight: z.number(),
      note: z.string()
    }),
    sensationalism: z.object({
      score: z.number().min(0).max(100),
      weight: z.number(),
      note: z.string()
    }),
    fact_deviation: z.object({
      score: z.number().min(0).max(100),
      weight: z.number(),
      note: z.string()
    })
  }),
  interpretation: z.string()
});

const ManipulationAnalysisSchema = z.object({
  techniques_found: z.number(),
  techniques: z.array(ManipulationTechniqueSchema),
  overall_assessment: z.string()
});

const SummarySchema = z.object({
  main_events: z.string(),
  key_participants: z.array(z.string()),
  conclusions: z.string()
});

const MetadataSchema = z.object({
  word_count: z.number(),
  analysis_notes: z.string().optional()
});

const AnalyzedArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  source: z.string(),
  url: z.string(),
  date: z.string(),
  relevance: RelevanceSchema,
  summary: SummarySchema,
  political_orientation: PoliticalOrientationSchema,
  narrative_creation_index: NarrativeIndexSchema,
  manipulation_analysis: ManipulationAnalysisSchema,
  metadata: MetadataSchema
});

const ExcludedArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  reason: z.string()
});

const AggregateStatisticsSchema = z.object({
  avg_narrative_index: z.number(),
  political_distribution: z.object({
    skrajna_lewica: z.number(),
    lewica: z.number(),
    centrolewica: z.number(),
    centrum: z.number(),
    centroprawica: z.number(),
    prawica: z.number(),
    skrajna_prawica: z.number(),
    neutralny: z.number()
  }),
  most_common_techniques: z.array(z.object({
    id: z.string(),
    name: z.string(),
    count: z.number()
  })),
  sources_reliability_ranking: z.array(z.object({
    source: z.string(),
    avg_narrative_index: z.number(),
    neutrality_score: z.number()
  }))
});

export const DetailedAnalysisResponseSchema = z.object({
  search_phrase: z.string(),
  analysis_date: z.string(),
  total_articles: z.number(),
  analyzed_articles: z.number(),
  excluded_articles: z.array(ExcludedArticleSchema),
  articles: z.array(AnalyzedArticleSchema),
  aggregate_statistics: AggregateStatisticsSchema
});

export const SummarizeNewsResponseSchema = z.object({
  success: z.boolean(),
  title: z.string().optional(),
  summary: z.string().optional(),
  analysis: DetailedAnalysisResponseSchema.optional(),
  error: z.string().optional()
});

export type SummarizeNewsResponse = z.infer<typeof SummarizeNewsResponseSchema>;
export type DetailedAnalysis = z.infer<typeof DetailedAnalysisResponseSchema>;
export type AnalyzedArticle = z.infer<typeof AnalyzedArticleSchema>;
export type ManipulationTechnique = z.infer<typeof ManipulationTechniqueSchema>;
