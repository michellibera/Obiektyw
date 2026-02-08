-- CreateTable
CREATE TABLE "RawArticle" (
    "id" TEXT NOT NULL,
    "environment" TEXT NOT NULL DEFAULT 'prod',
    "canonicalUrl" TEXT NOT NULL,
    "hash" TEXT,
    "title" TEXT NOT NULL,
    "snippet" TEXT,
    "source" TEXT,
    "publishedAt" TIMESTAMP(3),
    "origin" TEXT,
    "enhancedQuery" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RawArticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopicCluster" (
    "id" TEXT NOT NULL,
    "environment" TEXT NOT NULL DEFAULT 'prod',
    "searchPhrase" TEXT,
    "objectiveTitle" TEXT,
    "summary" TEXT,
    "analysisJson" JSONB,
    "embedding" BYTEA,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'active',

    CONSTRAINT "TopicCluster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClusterMembership" (
    "id" TEXT NOT NULL,
    "environment" TEXT NOT NULL DEFAULT 'prod',
    "clusterId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,

    CONSTRAINT "ClusterMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalysisRun" (
    "id" TEXT NOT NULL,
    "environment" TEXT NOT NULL DEFAULT 'prod',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "statsJson" JSONB,
    "error" TEXT,

    CONSTRAINT "AnalysisRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RawArticle_environment_publishedAt_idx" ON "RawArticle"("environment", "publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "RawArticle_environment_canonicalUrl_key" ON "RawArticle"("environment", "canonicalUrl");

-- CreateIndex
CREATE INDEX "TopicCluster_environment_lastUpdatedAt_idx" ON "TopicCluster"("environment", "lastUpdatedAt");

-- CreateIndex
CREATE INDEX "ClusterMembership_environment_clusterId_idx" ON "ClusterMembership"("environment", "clusterId");

-- CreateIndex
CREATE UNIQUE INDEX "ClusterMembership_environment_clusterId_articleId_key" ON "ClusterMembership"("environment", "clusterId", "articleId");

-- AddForeignKey
ALTER TABLE "ClusterMembership" ADD CONSTRAINT "ClusterMembership_clusterId_fkey" FOREIGN KEY ("clusterId") REFERENCES "TopicCluster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClusterMembership" ADD CONSTRAINT "ClusterMembership_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "RawArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
