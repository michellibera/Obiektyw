import { z } from 'zod';

export const FetchContentSchema = z.object({
  url: z.string().url('Invalid URL').max(2000)
});

export type FetchContentInput = z.infer<typeof FetchContentSchema>;

export const FetchContentResponseSchema = z.object({
  success: z.boolean(),
  content: z.string().optional(),
  title: z.string().optional(),
  length: z.number().optional(),
  error: z.string().optional()
});

export type FetchContentResponse = z.infer<typeof FetchContentResponseSchema>;
