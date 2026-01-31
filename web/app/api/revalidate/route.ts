import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const RevalidateSchema = z.object({
  path: z.string().min(1, 'Path is required'),
  secret: z.string().optional()
});

export async function POST(request: Request) {
  try {
    // Optional: Verify secret token for security
    const secret = process.env.REVALIDATION_SECRET;
    if (secret) {
      const body = await request.json();
      if (body.secret !== secret) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    const body = await request.json();
    const validation = RevalidateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { path } = validation.data;
    revalidatePath(path);

    return NextResponse.json({
      success: true,
      message: `Cache revalidated for path: ${path}`
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
