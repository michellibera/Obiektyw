-- AlterTable
ALTER TABLE "RawArticle" ADD COLUMN "createdByRunId" TEXT;

-- AlterTable
ALTER TABLE "TopicCluster" ADD COLUMN "createdByRunId" TEXT;

-- CreateIndex
CREATE INDEX "RawArticle_environment_createdByRunId_idx" ON "RawArticle"("environment", "createdByRunId");

-- CreateIndex
CREATE INDEX "TopicCluster_environment_createdByRunId_idx" ON "TopicCluster"("environment", "createdByRunId");

-- AddForeignKey
ALTER TABLE "RawArticle" ADD CONSTRAINT "RawArticle_createdByRunId_fkey" FOREIGN KEY ("createdByRunId") REFERENCES "AnalysisRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicCluster" ADD CONSTRAINT "TopicCluster_createdByRunId_fkey" FOREIGN KEY ("createdByRunId") REFERENCES "AnalysisRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;
