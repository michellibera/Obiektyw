import { z } from 'zod';
import { splitCommaList } from './normalizers';
import { RelevanceSchema, PoliticalOrientationSchema } from './political.schema';
import { NarrativeIndexSchema } from './narrative.schema';
import { ManipulationAnalysisSchema } from './manipulation.schema';

export const SummarySchema = z.object({
  main_events: z.string(),
  key_participants: z.preprocess((value: unknown) => {
    if (Array.isArray(value)) {
      return value.map(item => (typeof item === 'string' ? item.trim() : String(item))).filter(Boolean);
    }
    if (typeof value === 'string') {
      return splitCommaList(value);
    }
    return [];
  }, z.array(z.string())),
  conclusions: z.string()
});

export const MetadataSchema = z.object({
  word_count: z.number(),
  analysis_notes: z.string().optional()
});

export const AnalyzedArticleSchema = z.object({
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

export const ExcludedArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  reason: z.string()
});

export type Summary = z.infer<typeof SummarySchema>;
export type Metadata = z.infer<typeof MetadataSchema>;
export type AnalyzedArticle = z.infer<typeof AnalyzedArticleSchema>;
export type ExcludedArticle = z.infer<typeof ExcludedArticleSchema>;
