/*
  Warnings:

  - The primary key for the `Admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `admin_id` on the `Admin` table. All the data in the column will be lost.
  - The primary key for the `Cart` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cart_id` on the `Cart` table. All the data in the column will be lost.
  - The primary key for the `Comment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `comment_id` on the `Comment` table. All the data in the column will be lost.
  - The primary key for the `Coupon` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `code` on the `Coupon` table. All the data in the column will be lost.
  - The primary key for the `Grocery` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `SKU` on the `Grocery` table. All the data in the column will be lost.
  - The primary key for the `Grocery_Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `go_id` on the `Grocery_Order` table. All the data in the column will be lost.
  - The primary key for the `Listed_Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `lp_id` on the `Listed_Product` table. All the data in the column will be lost.
  - The primary key for the `Logs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `log_id` on the `Logs` table. All the data in the column will be lost.
  - The primary key for the `Order_History` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `oh_id` on the `Order_History` table. All the data in the column will be lost.
  - The primary key for the `Order_Ticket` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ot_id` on the `Order_Ticket` table. All the data in the column will be lost.
  - The primary key for the `Supplier` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `supplier_id` on the `Supplier` table. All the data in the column will be lost.
  - The primary key for the `Supply_Item` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `batch_id` on the `Supply_Item` table. All the data in the column will be lost.
  - The primary key for the `Wishlist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `wishlist_id` on the `Wishlist` table. All the data in the column will be lost.
  - The required column `id` was added to the `Admin` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `id` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Comment` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `id` to the `Coupon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Grocery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Grocery_Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Listed_Product` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Logs` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Made the column `admin_id` on table `Logs` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `id` to the `Order_History` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Order_Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Supply_Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Wishlist` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Cart_Item" DROP CONSTRAINT "Cart_Item_SKU_fkey";

-- DropForeignKey
ALTER TABLE "Cart_Item" DROP CONSTRAINT "Cart_Item_cart_id_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_SKU_fkey";

-- DropForeignKey
ALTER TABLE "Grocery_Order" DROP CONSTRAINT "Grocery_Order_lp_id_fkey";

-- DropForeignKey
ALTER TABLE "Grocery_Order" DROP CONSTRAINT "Grocery_Order_ot_id_fkey";

-- DropForeignKey
ALTER TABLE "Listed_Product" DROP CONSTRAINT "Listed_Product_SKU_fkey";

-- DropForeignKey
ALTER TABLE "Listed_Product" DROP CONSTRAINT "Listed_Product_batch_id_fkey";

-- DropForeignKey
ALTER TABLE "Wishlist_Item" DROP CONSTRAINT "Wishlist_Item_SKU_fkey";

-- DropForeignKey
ALTER TABLE "Wishlist_Item" DROP CONSTRAINT "Wishlist_Item_wishlist_id_fkey";

-- DropForeignKey
ALTER TABLE "_CouponToOrder_Ticket" DROP CONSTRAINT "_CouponToOrder_Ticket_A_fkey";

-- DropForeignKey
ALTER TABLE "_CouponToOrder_Ticket" DROP CONSTRAINT "_CouponToOrder_Ticket_B_fkey";

-- AlterTable
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_pkey",
DROP COLUMN "admin_id",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Admin_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_pkey",
DROP COLUMN "cart_id",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Cart_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_pkey",
DROP COLUMN "comment_id",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Comment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Coupon" DROP CONSTRAINT "Coupon_pkey",
DROP COLUMN "code",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Grocery" DROP CONSTRAINT "Grocery_pkey",
DROP COLUMN "SKU",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Grocery_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Grocery_Order" DROP CONSTRAINT "Grocery_Order_pkey",
DROP COLUMN "go_id",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Grocery_Order_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Listed_Product" DROP CONSTRAINT "Listed_Product_pkey",
DROP COLUMN "lp_id",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Listed_Product_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Logs" DROP CONSTRAINT "Logs_pkey",
DROP COLUMN "log_id",
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "admin_id" SET NOT NULL,
ADD CONSTRAINT "Logs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Order_History" DROP CONSTRAINT "Order_History_pkey",
DROP COLUMN "oh_id",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Order_History_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Order_Ticket" DROP CONSTRAINT "Order_Ticket_pkey",
DROP COLUMN "ot_id",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Order_Ticket_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Supplier" DROP CONSTRAINT "Supplier_pkey",
DROP COLUMN "supplier_id",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Supply_Item" DROP CONSTRAINT "Supply_Item_pkey",
DROP COLUMN "batch_id",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Supply_Item_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Wishlist" DROP CONSTRAINT "Wishlist_pkey",
DROP COLUMN "wishlist_id",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Cart_Item" ADD CONSTRAINT "Cart_Item_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart_Item" ADD CONSTRAINT "Cart_Item_SKU_fkey" FOREIGN KEY ("SKU") REFERENCES "Grocery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist_Item" ADD CONSTRAINT "Wishlist_Item_wishlist_id_fkey" FOREIGN KEY ("wishlist_id") REFERENCES "Wishlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist_Item" ADD CONSTRAINT "Wishlist_Item_SKU_fkey" FOREIGN KEY ("SKU") REFERENCES "Grocery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grocery_Order" ADD CONSTRAINT "Grocery_Order_ot_id_fkey" FOREIGN KEY ("ot_id") REFERENCES "Order_Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grocery_Order" ADD CONSTRAINT "Grocery_Order_lp_id_fkey" FOREIGN KEY ("lp_id") REFERENCES "Listed_Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listed_Product" ADD CONSTRAINT "Listed_Product_SKU_fkey" FOREIGN KEY ("SKU") REFERENCES "Grocery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listed_Product" ADD CONSTRAINT "Listed_Product_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "Supply_Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_SKU_fkey" FOREIGN KEY ("SKU") REFERENCES "Grocery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CouponToOrder_Ticket" ADD CONSTRAINT "_CouponToOrder_Ticket_A_fkey" FOREIGN KEY ("A") REFERENCES "Coupon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CouponToOrder_Ticket" ADD CONSTRAINT "_CouponToOrder_Ticket_B_fkey" FOREIGN KEY ("B") REFERENCES "Order_Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
