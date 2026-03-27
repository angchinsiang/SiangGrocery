/*
  Warnings:

  - A unique constraint covering the columns `[cart_id,SKU]` on the table `Cart_Item` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ot_id,lp_id]` on the table `Grocery_Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[SKU,batch_id]` on the table `Listed_Product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Media_Category" AS ENUM ('VEGETABLE', 'FRUIT', 'MEAT', 'DAIRY', 'OTHER', 'MARKETING_BANNER');

-- AlterTable
ALTER TABLE "Grocery_Order" ALTER COLUMN "quantity" SET DEFAULT 1;

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "category" "Media_Category" NOT NULL,
    "name" TEXT NOT NULL,
    "altText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grocery_Media" (
    "SKU" TEXT NOT NULL,
    "media_id" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Grocery_Media_pkey" PRIMARY KEY ("SKU","media_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cart_Item_cart_id_SKU_key" ON "Cart_Item"("cart_id", "SKU");

-- CreateIndex
CREATE UNIQUE INDEX "Grocery_Order_ot_id_lp_id_key" ON "Grocery_Order"("ot_id", "lp_id");

-- CreateIndex
CREATE UNIQUE INDEX "Listed_Product_SKU_batch_id_key" ON "Listed_Product"("SKU", "batch_id");

-- AddForeignKey
ALTER TABLE "Grocery_Media" ADD CONSTRAINT "Grocery_Media_SKU_fkey" FOREIGN KEY ("SKU") REFERENCES "Grocery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grocery_Media" ADD CONSTRAINT "Grocery_Media_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
