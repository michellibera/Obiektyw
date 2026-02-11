import { NextResponse } from 'next/server';
import { searchNews, searchWeb } from '@/lib/services/brave';
import { NewsSearchParamsSchema } from '@/lib/schemas';
import { successResponse, errorResponse, ValidationError } from '@/lib/errors';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams);

    const validation = NewsSearchParamsSchema.safeParse(params);
    if (!validation.success) {
      throw new ValidationError('Invalid parameters', validation.error.flatten());
    }

    const { q, count, freshness, type } = validation.data;

    const results = type === 'web'
      ? await searchWeb(q, {
          count: Math.min(count, 20),
          freshness,
          country: 'PL',
          search_lang: 'pl',
          extra_snippets: true
        })
      : await searchNews(q, {
          count,
          freshness,
          country: 'PL',
          search_lang: 'pl',
          extra_snippets: true
        });

    return successResponse({
      results,
      count: results.length
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return errorResponse(error.message, error.statusCode, error.details);
    }
    console.error('Error fetching news:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Unknown error',
      500
    );
  }
}
