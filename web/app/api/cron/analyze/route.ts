import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import { getDataEnv } from '@/lib/config/data-env';
import { searchNews } from '@/lib/services/brave';
import { generateEnhancedQuery } from '@/lib/services/llm';
import { summarizeCluster } from '@/lib/services/analysis';
import { hashArticle, normalizeUrl } from '@/lib/utils/news';
import { successResponse, errorResponse, UnauthorizedError } from '@/lib/errors';

export const runtime = 'nodejs';

const GENERAL_QUERIES = ['Polska'];
const RELATED_COUNT = 12;
const GENERAL_COUNT = 20;
const FRESHNESS = 'pd';
const CLUSTER_WINDOW_HOURS = 48;

function getCronSecret() {
  return process.env.CRON_SECRET || '';
}

function isAuthorized(request: Request): boolean {
  const secret = getCronSecret();
  if (!secret) return true;

  const authHeader = request.headers.get('authorization');
  if (authHeader === `Bearer ${secret}`) return true;

  const legacyHeader = request.headers.get('x-cron-secret');
  return legacyHeader === secret;
}

async function insertRawArticle(input: {
  environment: string;
  runId: string;
  canonicalUrl: string;
  hash: string;
  title: string;
  snippet?: string | null;
  source?: string | null;
  publishedAt?: Date | null;
  origin?: string | null;
  enhancedQuery?: string | null;
}): Promise<{ record: Awaited<ReturnType<typeof prisma.rawArticle.create>> | null; created: boolean }> {
  try {
    const record = await prisma.rawArticle.create({
      data: {
        environment: input.environment,
        createdByRunId: input.runId,
        canonicalUrl: input.canonicalUrl,
        hash: input.hash,
        title: input.title,
        snippet: input.snippet ?? null,
        source: input.source ?? null,
        publishedAt: input.publishedAt ?? null,
        origin: input.origin ?? null,
        enhancedQuery: input.enhancedQuery ?? null,
      },
    });
    return { record, created: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const record = await prisma.rawArticle.findFirst({
        where: { environment: input.environment, canonicalUrl: input.canonicalUrl },
      });
      return { record, created: false };
    }
    throw error;
  }
}

async function ensureClusterMembership(environment: string, clusterId: string, articleId: string) {
  try {
    await prisma.clusterMembership.create({
      data: {
        environment,
        clusterId,
        articleId,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return;
    }
    throw error;
  }
}

async function handleAnalyze(request: Request) {
  if (!isAuthorized(request)) {
    throw new UnauthorizedError('Invalid or missing authorization');
  }

  const environment = getDataEnv();
  const startedAt = new Date();
  const run = await prisma.analysisRun.create({
    data: {
      environment,
      startedAt,
    },
  });

  const stats = {
    fetched: 0,
    inserted: 0,
    relatedFetched: 0,
    clustersCreated: 0,
    clustersUpdated: 0,
  };

  try {
    const allNewArticles: string[] = [];
    const enhancedQueryById = new Map<string, string>();
    const relatedBySeedId = new Map<string, string[]>();

    for (const query of GENERAL_QUERIES) {
      const results = await searchNews(query, {
        count: GENERAL_COUNT,
        freshness: FRESHNESS,
        country: 'PL',
        search_lang: 'pl',
        extra_snippets: true,
      });

      stats.fetched += results.length;

      for (const result of results) {
        const canonicalUrl = normalizeUrl(result.url);
        const snippet = result.extra_snippets?.join(' ') || result.description || '';
        const hash = hashArticle({
          canonicalUrl,
          title: result.title,
          snippet,
        });

        const inserted = await insertRawArticle({
          environment,
          runId: run.id,
          canonicalUrl,
          hash,
          title: result.title,
          snippet,
          source: result.profile?.name || null,
          origin: 'general',
        });

        if (inserted.record && inserted.created) {
          stats.inserted += 1;
          allNewArticles.push(inserted.record.id);
        }
      }
    }

    const newArticles = await prisma.rawArticle.findMany({
      where: {
        environment,
        id: { in: allNewArticles },
      },
    });

    for (const article of newArticles) {
      const generatedQuery = await generateEnhancedQuery(article.title, [article.snippet || '']);
      const enhancedQuery = generatedQuery.trim() || article.title;
      await prisma.rawArticle.update({
        where: { id: article.id },
        data: { enhancedQuery },
      });
      enhancedQueryById.set(article.id, enhancedQuery);

      const related = await searchNews(enhancedQuery, {
        count: RELATED_COUNT,
        freshness: FRESHNESS,
        country: 'PL',
        search_lang: 'pl',
        extra_snippets: true,
      });

      stats.relatedFetched += related.length;

      for (const result of related) {
        const canonicalUrl = normalizeUrl(result.url);
        const snippet = result.extra_snippets?.join(' ') || result.description || '';
        const hash = hashArticle({
          canonicalUrl,
          title: result.title,
          snippet,
        });

        const relatedRecord = await insertRawArticle({
          environment,
          runId: run.id,
          canonicalUrl,
          hash,
          title: result.title,
          snippet,
          source: result.profile?.name || null,
          origin: 'related',
        });
        if (relatedRecord.record) {
          const existing = relatedBySeedId.get(article.id) || [];
          existing.push(relatedRecord.record.id);
          relatedBySeedId.set(article.id, existing);
        }
      }
    }

    const windowStart = new Date(Date.now() - CLUSTER_WINDOW_HOURS * 60 * 60 * 1000);
    const updatedClusterIds: string[] = [];

    for (const article of newArticles) {
      const searchPhrase = enhancedQueryById.get(article.id) || article.title;
      const existingCluster = await prisma.topicCluster.findFirst({
        where: {
          environment,
          searchPhrase,
          lastUpdatedAt: { gte: windowStart },
        },
        orderBy: { lastUpdatedAt: 'desc' },
      });

      let clusterId: string;
      if (existingCluster) {
        clusterId = existingCluster.id;
        await prisma.topicCluster.update({
          where: { id: clusterId },
          data: { lastUpdatedAt: new Date() },
        });
        stats.clustersUpdated += 1;
      } else {
        const cluster = await prisma.topicCluster.create({
          data: {
            environment,
            searchPhrase,
            createdByRunId: run.id,
            lastUpdatedAt: new Date(),
          },
        });
        clusterId = cluster.id;
        stats.clustersCreated += 1;
      }

      await ensureClusterMembership(environment, clusterId, article.id);
      const relatedIds = relatedBySeedId.get(article.id) || [];
      for (const relatedId of relatedIds) {
        await ensureClusterMembership(environment, clusterId, relatedId);
      }
      updatedClusterIds.push(clusterId);
    }

    const uniqueClusterIds = Array.from(new Set(updatedClusterIds));
    for (const clusterId of uniqueClusterIds) {
      const cluster = await prisma.topicCluster.findFirst({
        where: { id: clusterId, environment },
        include: { memberships: { include: { article: true } } },
      });

      if (!cluster) continue;

      const articlesForAnalysis = cluster.memberships.map(membership => ({
        title: membership.article.title,
        content: membership.article.snippet || membership.article.title,
        url: membership.article.canonicalUrl,
      }));

      if (articlesForAnalysis.length === 0) continue;

      const analysis = await summarizeCluster(articlesForAnalysis, cluster.searchPhrase || undefined);
      await prisma.topicCluster.update({
        where: { id: cluster.id },
        data: {
          objectiveTitle: analysis.title,
          summary: analysis.summary,
          analysisJson: analysis.analysisRaw ?? undefined,
          lastUpdatedAt: new Date(),
        },
      });
    }

    await prisma.analysisRun.update({
      where: { id: run.id },
      data: {
        finishedAt: new Date(),
        statsJson: stats,
      },
    });

    return successResponse({ runId: run.id, stats });
  } catch (error) {
    await prisma.analysisRun.update({
      where: { id: run.id },
      data: {
        finishedAt: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    throw error;
  }
}

export async function GET(request: Request) {
  try {
    return await handleAnalyze(request);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return errorResponse(error.message, error.statusCode, undefined, error.code);
    }
    console.error('Cron analysis error:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Unknown error',
      500
    );
  }
}

export async function POST(request: Request) {
  try {
    return await handleAnalyze(request);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return errorResponse(error.message, error.statusCode, undefined, error.code);
    }
    console.error('Cron analysis error:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Unknown error',
      500
    );
  }
}
