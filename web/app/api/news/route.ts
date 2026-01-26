import { NextResponse } from 'next/server';
import { searchNews } from '@/lib/services/brave';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || 'Polska';
    const count = parseInt(searchParams.get('count') || '20');
    const freshness = searchParams.get('freshness') || 'pd'; // Last day by default

    const results = await searchNews(query, {
      count,
      freshness,
      country: 'PL',
      search_lang: 'pl'
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
