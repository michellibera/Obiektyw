import { z } from 'zod';

export const NewsSearchParamsSchema = z.object({
  q: z.string().min(1, 'Query is required').max(500, 'Query too long'),
  count: z.coerce.number().int().min(1).max(100).default(20),
  freshness: z.enum(['pd', 'pw', 'pm', 'py']).default('pd'),
  type: z.enum(['news', 'web']).default('news')
});

export type NewsSearchParams = z.infer<typeof NewsSearchParamsSchema>;
