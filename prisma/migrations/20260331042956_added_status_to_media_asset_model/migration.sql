-- CreateEnum
CREATE TYPE "Media_Status" AS ENUM ('ACTIVE', 'DRAFT');

-- AlterTable
ALTER TABLE "MediaAsset" ADD COLUMN     "status" "Media_Status" NOT NULL DEFAULT 'DRAFT';
