import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { extractContent } = await import('@/lib/utils/content-extractor');
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NewsAggregator/1.0)',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const extracted = await extractContent(html, url);

    if (!extracted) {
      return NextResponse.json(
        { success: false, error: 'Failed to extract content' },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      content: extracted.textContent,
      title: extracted.title,
      length: extracted.length
    });
  } catch (error) {
    console.error('Fetch content error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
