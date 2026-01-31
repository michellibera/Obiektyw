import { NextResponse } from 'next/server';
import { searchNews, searchWeb } from '@/lib/services/brave';
import { NewsSearchParamsSchema } from '@/lib/schemas';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams);

    const validation = NewsSearchParamsSchema.safeParse(params);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid parameters',
          details: validation.error.flatten()
        },
        { status: 400 }
      );
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

    return NextResponse.json({
      success: true,
      results,
      count: results.length
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
