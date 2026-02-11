import { z } from 'zod';
import { normalizePoliticalCategory, normalizeRelevanceScore, normalizeConfidence } from './normalizers';

export const PoliticalOrientationSchema = z.object({
  category: z.preprocess(
    normalizePoliticalCategory,
    z.enum([
      'skrajna_lewica',
      'lewica',
      'centrolewica',
      'centrum',
      'centroprawica',
      'prawica',
      'skrajna_prawica',
      'neutralny'
    ])
  ),
  confidence: z.preprocess(normalizeConfidence, z.number().min(0).max(100)),
  justification: z.string(),
  neutrality_bonus: z.boolean()
});

export const RelevanceSchema = z.object({
  score: z.preprocess(normalizeRelevanceScore, z.enum(['pełny', 'częściowy', 'brak'])),
  note: z.string().optional()
});

export type PoliticalOrientation = z.infer<typeof PoliticalOrientationSchema>;
export type Relevance = z.infer<typeof RelevanceSchema>;
