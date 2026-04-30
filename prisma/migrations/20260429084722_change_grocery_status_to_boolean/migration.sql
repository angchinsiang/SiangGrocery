/*
  Warnings:

  - The `status` column on the `Grocery` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Supply_Item` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Grocery" DROP COLUMN "status",
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Supply_Item" DROP COLUMN "status",
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;
