import { z } from 'zod';

export const ArticleSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  url: z.string().url()
});

export const SummarizeNewsSchema = z.object({
  articles: z.array(ArticleSchema).min(1, 'At least one article is required').max(50)
});

export type SummarizeNewsInput = z.infer<typeof SummarizeNewsSchema>;

export const SummarizeNewsResponseSchema = z.object({
  success: z.boolean(),
  summary: z.string().optional(),
  error: z.string().optional()
});

export type SummarizeNewsResponse = z.infer<typeof SummarizeNewsResponseSchema>;
