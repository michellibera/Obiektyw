import { prisma } from '@/lib/db/prisma';
import { getDataEnv } from '@/lib/config/data-env';
import { successResponse, errorResponse } from '@/lib/errors';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = Number(searchParams.get('limit'));
    const offsetParam = Number(searchParams.get('offset'));
    const limit = Math.min(Number.isFinite(limitParam) ? limitParam : 20, 50);
    const offset = Math.max(Number.isFinite(offsetParam) ? offsetParam : 0, 0);
    const environment = getDataEnv();

    const topics = await prisma.topicCluster.findMany({
      where: { environment },
      orderBy: { lastUpdatedAt: 'desc' },
      skip: offset,
      take: limit,
      select: {
        id: true,
        objectiveTitle: true,
        summary: true,
        lastUpdatedAt: true,
      },
    });

    return successResponse({
      topics: topics.map(topic => ({
        id: topic.id,
        objectiveTitle: topic.objectiveTitle || '',
        summary: topic.summary || '',
        lastUpdatedAt: topic.lastUpdatedAt.toISOString(),
      })),
      count: topics.length,
    });
  } catch (error) {
    console.error('Error fetching topics:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Unknown error',
      500
    );
  }
}
