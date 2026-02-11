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
  analysis: DetailedAnalysis | null;
  analysisRaw: unknown | null;
}

export async function summarizeCluster(
  articles: ArticleInput[],
  searchPhrase?: string
): Promise<AnalysisResult> {
  if (env.features.useMockAnalysis) {
    return {
      title: mockSummarizeNewsResult.title,
      summary: mockSummarizeNewsResult.summary,
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

  let parsedResponse: { title?: string; summary?: string; analysis?: unknown };
  let parsedAnalysis: DetailedAnalysis | null = null;
  let analysisRaw: unknown | null = null;

  try {
    const cleanedResponse = response
      .trim()
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    parsedResponse = JSON.parse(cleanedResponse);
    analysisRaw = parsedResponse.analysis ?? null;

    if (analysisRaw) {
      const analysisParse = DetailedAnalysisResponseSchema.safeParse(analysisRaw);
      parsedAnalysis = analysisParse.success ? analysisParse.data : null;
    }
  } catch {
    parsedResponse = {
      title: articles[0]?.title || 'Wiadomość',
      summary: response.trim(),
      analysis: null,
    };
    analysisRaw = null;
  }

  return {
    title: parsedResponse.title || '',
    summary: parsedResponse.summary || '',
    analysis: parsedAnalysis,
    analysisRaw,
  };
}
