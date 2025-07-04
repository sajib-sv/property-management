-- AlterTable
ALTER TABLE "News" ALTER COLUMN "firstPublishedAt" DROP NOT NULL,
ALTER COLUMN "isPublished" SET DEFAULT false;
