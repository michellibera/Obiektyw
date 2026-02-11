import { z } from 'zod';
import { normalizeNumericString } from './normalizers';

const NarrativeComponentSchema = z.object({
  score: z.preprocess(normalizeNumericString, z.number().min(0).max(100)),
  weight: z.number(),
  note: z.string()
});

export const NarrativeIndexSchema = z.object({
  total_score: z.preprocess(normalizeNumericString, z.number().min(0).max(100)),
  components: z.object({
    bias: NarrativeComponentSchema,
    sensationalism: NarrativeComponentSchema,
    fact_deviation: NarrativeComponentSchema
  }),
  interpretation: z.string()
});

export type NarrativeIndex = z.infer<typeof NarrativeIndexSchema>;
