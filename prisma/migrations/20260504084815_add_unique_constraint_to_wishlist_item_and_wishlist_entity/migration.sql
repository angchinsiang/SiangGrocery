/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `Wishlist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[wishlist_id,SKU]` on the table `Wishlist_Item` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_user_id_key" ON "Wishlist"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_Item_wishlist_id_SKU_key" ON "Wishlist_Item"("wishlist_id", "SKU");
