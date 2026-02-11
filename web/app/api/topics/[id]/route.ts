import { prisma } from '@/lib/db/prisma';
import { getDataEnv } from '@/lib/config/data-env';
import { DetailedAnalysisResponseSchema } from '@/lib/schemas';
import { successResponse, errorResponse, NotFoundError } from '@/lib/errors';

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const environment = getDataEnv();

    const topic = await prisma.topicCluster.findFirst({
      where: { id, environment },
      include: {
        memberships: {
          include: {
            article: true,
          },
        },
      },
    });

    if (!topic) {
      throw new NotFoundError('Topic not found');
    }

    const parsedAnalysis = DetailedAnalysisResponseSchema.safeParse(topic.analysisJson);

    return successResponse({
      topic: {
        id: topic.id,
        objectiveTitle: topic.objectiveTitle || '',
        summary: topic.summary || '',
        category: topic.category || 'Inne',
        analysis: parsedAnalysis.success ? parsedAnalysis.data : null,
        sources: topic.memberships.map(membership => ({
          title: membership.article.title,
          url: membership.article.canonicalUrl,
          source: membership.article.source || '',
          publishedAt: membership.article.publishedAt
            ? membership.article.publishedAt.toISOString()
            : null,
        })),
      },
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return errorResponse(error.message, error.statusCode, undefined, error.code);
    }
    console.error('Error fetching topic details:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Unknown error',
      500
    );
  }
}
