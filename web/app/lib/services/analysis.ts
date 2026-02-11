import { sendPrompt } from './llm';
import { env } from '../config/env';
import { mockSummarizeNewsResult } from '../mocks/analysis';
import { DetailedAnalysisResponseSchema, type DetailedAnalysis } from '../schemas/summarizeNews';
import { buildAnalysisPrompt, prepareArticlesForPrompt } from '../prompts';

interface ArticleInput {
  title: string;
  content: string;
  url: string;
}

interface AnalysisResult {
  title: string;
  summary: string;
  category: string;
  analysis: DetailedAnalysis | null;
  analysisRaw: unknown | null;
}

const ALLOWED_CATEGORIES = new Set([
  'Polityka',
  'Gospodarka',
  'Spoleczenstwo',
  'Zdrowie',
  'Edukacja',
  'Prawo',
  'Bezpieczenstwo',
  'Swiat',
  'Technologia',
  'Klimat',
  'Kultura',
  'Sport',
  'Inne',
]);

function normalizeCategory(value: unknown): string {
  if (typeof value !== 'string') return 'Inne';
  const trimmed = value.trim();
  return ALLOWED_CATEGORIES.has(trimmed) ? trimmed : 'Inne';
}

export async function summarizeCluster(
  articles: ArticleInput[],
  searchPhrase?: string
): Promise<AnalysisResult> {
  if (env.features.useMockAnalysis) {
    return {
      title: mockSummarizeNewsResult.title,
      summary: mockSummarizeNewsResult.summary,
      category: 'Inne',
      analysis: mockSummarizeNewsResult.analysis,
      analysisRaw: mockSummarizeNewsResult.analysis,
    };
  }

  const currentDate = new Date().toISOString();
  const articlesForPrompt = prepareArticlesForPrompt(articles, currentDate);
  const prompt = buildAnalysisPrompt({
    articles: articlesForPrompt,
    searchPhrase,
    currentDate
  });

  const response = await sendPrompt(prompt, {
    max_tokens: 16000,
    temperature: 0.3,
  });

  let parsedResponse: { title?: string; summary?: string; category?: unknown; analysis?: unknown };
  let parsedAnalysis: DetailedAnalysis | null = null;
  let analysisRaw: unknown | null = null;
  let category = 'Inne';

  try {
    const cleanedResponse = response
      .trim()
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    parsedResponse = JSON.parse(cleanedResponse);
    category = normalizeCategory(parsedResponse.category);
    analysisRaw = parsedResponse.analysis ?? null;

    if (analysisRaw) {
      const analysisParse = DetailedAnalysisResponseSchema.safeParse(analysisRaw);
      parsedAnalysis = analysisParse.success ? analysisParse.data : null;
    }
  } catch {
    parsedResponse = {
      title: articles[0]?.title || 'Wiadomość',
      summary: response.trim(),
      category: 'Inne',
      analysis: null,
    };
    analysisRaw = null;
  }

  return {
    title: parsedResponse.title || '',
    summary: parsedResponse.summary || '',
    category,
    analysis: parsedAnalysis,
    analysisRaw,
  };
}
