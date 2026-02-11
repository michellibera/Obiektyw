import { z } from 'zod';

export const SeedDedupeResponseSchema = z.object({
  keep: z.array(z.string().min(1)).default([]),
});

export type SeedDedupeResponse = z.infer<typeof SeedDedupeResponseSchema>;
