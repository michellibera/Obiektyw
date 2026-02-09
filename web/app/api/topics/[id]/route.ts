import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getDataEnv } from '@/lib/config/data-env';
import { DetailedAnalysisResponseSchema } from '@/lib/schemas';

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
      return NextResponse.json(
        { success: false, error: 'Topic not found' },
        { status: 404 }
      );
    }

    const parsedAnalysis = DetailedAnalysisResponseSchema.safeParse(topic.analysisJson);

    return NextResponse.json({
      success: true,
      topic: {
        id: topic.id,
        objectiveTitle: topic.objectiveTitle || '',
        summary: topic.summary || '',
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
    console.error('Error fetching topic details:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
