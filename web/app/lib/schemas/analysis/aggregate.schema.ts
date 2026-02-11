import { z } from 'zod';
import { normalizeNumericString } from './normalizers';

export const AggregateStatisticsSchema = z.object({
  avg_narrative_index: z.preprocess(normalizeNumericString, z.number()),
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

export type AggregateStatistics = z.infer<typeof AggregateStatisticsSchema>;
