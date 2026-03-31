/*
  Warnings:

  - Added the required column `type` to the `MediaAsset` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Media_Type" AS ENUM ('IMAGE', 'VIDEO');

-- AlterTable
ALTER TABLE "MediaAsset" ADD COLUMN     "type" "Media_Type" NOT NULL;
