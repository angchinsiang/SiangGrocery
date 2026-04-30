/*
  Warnings:

  - You are about to drop the column `shelfLife` on the `Grocery` table. All the data in the column will be lost.
  - Added the required column `expiryDate` to the `Grocery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Grocery" DROP COLUMN "shelfLife",
ADD COLUMN     "expiryDate" TIMESTAMP(3) NOT NULL;
