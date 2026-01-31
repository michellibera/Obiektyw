import { z } from 'zod';

export const EnhanceQuerySchema = z.object({
  title: z.string().min(1, 'Title is required').max(500),
  snippets: z.array(z.string()).optional().default([])
});

export type EnhanceQueryInput = z.infer<typeof EnhanceQuerySchema>;

export const EnhanceQueryResponseSchema = z.object({
  success: z.boolean(),
  enhancedQuery: z.string().optional(),
  error: z.string().optional()
});

export type EnhanceQueryResponse = z.infer<typeof EnhanceQueryResponseSchema>;
