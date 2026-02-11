import { sendPrompt } from '@/lib/services/llm';
import { EnhanceQuerySchema } from '@/lib/schemas';
import { successResponse, errorResponse, ValidationError } from '@/lib/errors';
import { buildEnhanceQueryPrompt } from '@/lib/prompts';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = EnhanceQuerySchema.safeParse(body);

    if (!validation.success) {
      throw new ValidationError('Invalid request body', validation.error.flatten());
    }

    const { title, snippets } = validation.data;

    const prompt = buildEnhanceQueryPrompt({ title, snippets });

    const enhancedQuery = await sendPrompt(prompt, {
      max_tokens: 50,
      temperature: 0.3
    });

    return successResponse({
      enhancedQuery: enhancedQuery.trim().replace(/^["']|["']$/g, '')
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return errorResponse(error.message, error.statusCode, error.details);
    }
    console.error('Error enhancing query:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Unknown error',
      500
    );
  }
}
