/*
  Warnings:

  - You are about to drop the column `resumeFileName` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `resumeUpdatedAt` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `resumeUrl` on the `SiteSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SiteSettings" DROP COLUMN "resumeFileName",
DROP COLUMN "resumeUpdatedAt",
DROP COLUMN "resumeUrl";
