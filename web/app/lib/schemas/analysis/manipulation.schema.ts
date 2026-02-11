import { z } from 'zod';
import { normalizeTechniqueCategory, normalizeSeverity } from './normalizers';

export const ManipulationTechniqueSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.preprocess(
    normalizeTechniqueCategory,
    z.enum(['narracyjna', 'atak', 'emocjonalna', 'błąd_logiczny'])
  ),
  quote: z.string(),
  explanation: z.string(),
  severity: z.preprocess(normalizeSeverity, z.enum(['niska', 'średnia', 'wysoka']))
});

export const ManipulationAnalysisSchema = z.object({
  techniques_found: z.number(),
  techniques: z.array(ManipulationTechniqueSchema),
  overall_assessment: z.string()
});

export type ManipulationTechnique = z.infer<typeof ManipulationTechniqueSchema>;
export type ManipulationAnalysis = z.infer<typeof ManipulationAnalysisSchema>;
