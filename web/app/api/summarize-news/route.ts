import { sendPrompt } from '@/lib/services/llm';
import { SummarizeNewsSchema } from '@/lib/schemas';
import { env } from '@/lib/config/env';
import { mockSummarizeNewsResult } from '@/lib/mocks/analysis';
import { successResponse, errorResponse, ValidationError } from '@/lib/errors';
import { buildAnalysisPrompt, prepareArticlesForPrompt } from '@/lib/prompts';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = SummarizeNewsSchema.safeParse(body);

    if (!validation.success) {
      throw new ValidationError('Invalid request body', validation.error.flatten());
    }

    const { articles, searchPhrase } = validation.data;
    const currentDate = new Date().toISOString();

    if (env.features.useMockAnalysis) {
      console.log('[MOCK MODE] Returning mock analysis data instead of calling LLM');
      return successResponse({
        title: mockSummarizeNewsResult.title,
        summary: mockSummarizeNewsResult.summary,
        analysis: mockSummarizeNewsResult.analysis
      });
    }

    const articlesForPrompt = prepareArticlesForPrompt(articles, currentDate);
    const prompt = buildAnalysisPrompt({
      articles: articlesForPrompt,
      searchPhrase,
      currentDate
    });

    const response = await sendPrompt(prompt, {
      max_tokens: 16000,
      temperature: 0.3
    });

    // Parse JSON response
    let parsedResponse;
    try {
      const cleanedResponse = response.trim()
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();

      parsedResponse = JSON.parse(cleanedResponse);
    } catch {
      console.error('Failed to parse JSON response, using fallback');
      parsedResponse = {
        title: articles[0]?.title || 'Wiadomość',
        summary: response.trim(),
        analysis: null
      };
    }

    return successResponse({
      title: parsedResponse.title || '',
      summary: parsedResponse.summary || '',
      analysis: parsedResponse.analysis || null
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return errorResponse(error.message, error.statusCode, error.details);
    }
    console.error('Error generating summary:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Unknown error',
      500
    );
  }
}
