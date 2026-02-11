import { FetchContentSchema } from '@/lib/schemas';
import { successResponse, errorResponse, ValidationError } from '@/lib/errors';

export async function POST(request: Request) {
  try {
    const { extractContent } = await import('@/lib/utils/content-extractor');
    const body = await request.json();
    const validation = FetchContentSchema.safeParse(body);

    if (!validation.success) {
      throw new ValidationError('Invalid request body', validation.error.flatten());
    }

    const { url } = validation.data;

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
      return errorResponse('Failed to extract content', 422);
    }

    return successResponse({
      content: extracted.textContent,
      title: extracted.title,
      length: extracted.length
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return errorResponse(error.message, error.statusCode, error.details);
    }
    console.error('Fetch content error:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Unknown error',
      500
    );
  }
}
