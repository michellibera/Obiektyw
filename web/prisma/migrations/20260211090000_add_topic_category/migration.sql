-- Add category to TopicCluster for filtering

ALTER TABLE "TopicCluster"
ADD COLUMN "category" TEXT NOT NULL DEFAULT 'Inne';

CREATE INDEX "TopicCluster_environment_category_lastUpdatedAt_idx"
ON "TopicCluster"("environment", "category", "lastUpdatedAt");
