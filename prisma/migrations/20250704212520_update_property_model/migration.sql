/*
  Warnings:

  - Added the required column `country` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "country" TEXT NOT NULL,
ALTER COLUMN "views" SET DEFAULT 0;
