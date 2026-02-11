import { z } from 'zod';
import { AnalyzedArticleSchema, ExcludedArticleSchema } from './article.schema';
import { AggregateStatisticsSchema } from './aggregate.schema';

// Re-export wszystkich schematów
export * from './normalizers';
export * from './manipulation.schema';
export * from './political.schema';
export * from './narrative.schema';
export * from './article.schema';
export * from './aggregate.schema';

// Główne schematy analizy
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

export type DetailedAnalysis = z.infer<typeof DetailedAnalysisResponseSchema>;
export type SummarizeNewsResponse = z.infer<typeof SummarizeNewsResponseSchema>;

// Schematy wejściowe
export const ArticleInputSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  url: z.string().url()
});

export const SummarizeNewsSchema = z.object({
  articles: z.array(ArticleInputSchema).min(1, 'At least one article is required').max(50),
  searchPhrase: z.string().optional()
});

export type SummarizeNewsInput = z.infer<typeof SummarizeNewsSchema>;
export type ArticleInput = z.infer<typeof ArticleInputSchema>;
