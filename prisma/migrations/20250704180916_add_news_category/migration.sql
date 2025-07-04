-- CreateEnum
CREATE TYPE "NewsCategory" AS ENUM ('GENERAL', 'REAL_ESTATE', 'TECHNOLOGY', 'LIFESTYLE', 'BUSINESS');

-- AlterTable
ALTER TABLE "News" ADD COLUMN     "category" TEXT;
