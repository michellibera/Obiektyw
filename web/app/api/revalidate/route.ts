import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { successResponse, errorResponse, ValidationError, UnauthorizedError } from '@/lib/errors';

const RevalidateSchema = z.object({
  path: z.string().min(1, 'Path is required'),
  secret: z.string().optional()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Optional: Verify secret token for security
    const secret = process.env.REVALIDATION_SECRET;
    if (secret && body.secret !== secret) {
      throw new UnauthorizedError('Invalid revalidation secret');
    }

    const validation = RevalidateSchema.safeParse(body);
    if (!validation.success) {
      throw new ValidationError('Invalid request body', validation.error.flatten());
    }

    const { path } = validation.data;
    revalidatePath(path);

    return successResponse({
      message: `Cache revalidated for path: ${path}`
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return errorResponse(error.message, error.statusCode, error.details);
    }
    if (error instanceof UnauthorizedError) {
      return errorResponse(error.message, error.statusCode, undefined, error.code);
    }
    console.error('Revalidation error:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Unknown error',
      500
    );
  }
}
