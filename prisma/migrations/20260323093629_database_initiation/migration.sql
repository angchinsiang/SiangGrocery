-- CreateEnum
CREATE TYPE "Coupon_Type" AS ENUM ('SHIPPING', 'DISCOUNT');

-- CreateEnum
CREATE TYPE "Coupon_Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "Payment_Method" AS ENUM ('COD', 'CARD', 'FPX', 'EWALLET');

-- CreateEnum
CREATE TYPE "Admin_Role" AS ENUM ('ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "Log_Action" AS ENUM ('MANUAL', 'SYSTEM');

-- CreateEnum
CREATE TYPE "Comment_Status" AS ENUM ('APPROVED', 'HIDDEN');

-- CreateEnum
CREATE TYPE "Supplier_Status" AS ENUM ('ACTIVE', 'INACTIVE', 'ON_HOLD', 'BLACKLISTED');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('VEGETABLE', 'FRUIT', 'MEAT', 'DAIRY', 'OTHER');

-- CreateEnum
CREATE TYPE "Form" AS ENUM ('FRESH', 'FROZEN', 'DRY', 'LIQUID', 'OTHER');

-- CreateEnum
CREATE TYPE "Purchase_Status" AS ENUM ('PENDING', 'DELIVERED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Cart_Item_Status" AS ENUM ('ACTIVE', 'INACTIVE', 'CONVERTED');

-- CreateEnum
CREATE TYPE "Grocery_Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "MoU" AS ENUM ('KG', 'G', 'L', 'ML', 'PCS');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT[],
    "phone" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "cart_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("cart_id")
);

-- CreateTable
CREATE TABLE "Cart_Item" (
    "id" TEXT NOT NULL,
    "cart_id" TEXT NOT NULL,
    "SKU" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "Cart_Item_Status" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Cart_Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grocery" (
    "SKU" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "form" "Form" NOT NULL,
    "MoU" "MoU" NOT NULL,
    "isPromotion" BOOLEAN NOT NULL DEFAULT false,
    "shelfLife" INTEGER NOT NULL,
    "status" "Grocery_Status" NOT NULL DEFAULT 'ACTIVE',
    "size" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Grocery_pkey" PRIMARY KEY ("SKU")
);

-- CreateTable
CREATE TABLE "Wishlist" (
    "wishlist_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("wishlist_id")
);

-- CreateTable
CREATE TABLE "Wishlist_Item" (
    "id" TEXT NOT NULL,
    "wishlist_id" TEXT NOT NULL,
    "SKU" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wishlist_Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coupon" (
    "code" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "Coupon_Status" NOT NULL DEFAULT 'ACTIVE',
    "type" "Coupon_Type" NOT NULL,
    "expiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Order_Ticket" (
    "ot_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completed_At" TIMESTAMP(3),
    "status" "Purchase_Status" NOT NULL DEFAULT 'PENDING',
    "total_amount" DOUBLE PRECISION NOT NULL,
    "payment_method" "Payment_Method" NOT NULL,

    CONSTRAINT "Order_Ticket_pkey" PRIMARY KEY ("ot_id")
);

-- CreateTable
CREATE TABLE "Grocery_Order" (
    "go_id" TEXT NOT NULL,
    "ot_id" TEXT NOT NULL,
    "lp_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "remark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Grocery_Order_pkey" PRIMARY KEY ("go_id")
);

-- CreateTable
CREATE TABLE "Listed_Product" (
    "lp_id" TEXT NOT NULL,
    "SKU" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,
    "total_qty" INTEGER NOT NULL,
    "expiration_date" TIMESTAMP(3) NOT NULL,
    "reserved_qty" INTEGER NOT NULL DEFAULT 0,
    "locked_in_qty" INTEGER NOT NULL DEFAULT 0,
    "isDisplay" BOOLEAN NOT NULL DEFAULT true,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Listed_Product_pkey" PRIMARY KEY ("lp_id")
);

-- CreateTable
CREATE TABLE "Supply_Item" (
    "batch_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "form" "Form" NOT NULL,
    "MoU" "MoU" NOT NULL,
    "description" TEXT NOT NULL,
    "status" "Grocery_Status" NOT NULL DEFAULT 'ACTIVE',
    "isDisplay" BOOLEAN NOT NULL DEFAULT true,
    "isAuto" BOOLEAN NOT NULL DEFAULT false,
    "size" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supply_Item_pkey" PRIMARY KEY ("batch_id")
);

-- CreateTable
CREATE TABLE "Order_History" (
    "oh_id" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,
    "supplier_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_cost" DOUBLE PRECISION NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "status" "Purchase_Status" NOT NULL DEFAULT 'PENDING',
    "payment_deadline" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_History_pkey" PRIMARY KEY ("oh_id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "supplier_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "halal_certified" BOOLEAN NOT NULL DEFAULT false,
    "organic_certified" BOOLEAN NOT NULL DEFAULT false,
    "payment_term" INTEGER NOT NULL DEFAULT 90,
    "min_order" DOUBLE PRECISION NOT NULL DEFAULT 1000,
    "status" "Supplier_Status" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("supplier_id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "comment_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "SKU" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "media" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "helpful" INTEGER NOT NULL DEFAULT 0,
    "status" "Comment_Status" NOT NULL DEFAULT 'APPROVED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("comment_id")
);

-- CreateTable
CREATE TABLE "Logs" (
    "log_id" TEXT NOT NULL,
    "admin_id" TEXT,
    "action" "Log_Action" NOT NULL,
    "details" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("log_id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "admin_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Admin_Role" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("admin_id")
);

-- CreateTable
CREATE TABLE "_CouponToOrder_Ticket" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CouponToOrder_Ticket_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_email_key" ON "Supplier"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE INDEX "_CouponToOrder_Ticket_B_index" ON "_CouponToOrder_Ticket"("B");

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart_Item" ADD CONSTRAINT "Cart_Item_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "Cart"("cart_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart_Item" ADD CONSTRAINT "Cart_Item_SKU_fkey" FOREIGN KEY ("SKU") REFERENCES "Grocery"("SKU") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist_Item" ADD CONSTRAINT "Wishlist_Item_wishlist_id_fkey" FOREIGN KEY ("wishlist_id") REFERENCES "Wishlist"("wishlist_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist_Item" ADD CONSTRAINT "Wishlist_Item_SKU_fkey" FOREIGN KEY ("SKU") REFERENCES "Grocery"("SKU") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_Ticket" ADD CONSTRAINT "Order_Ticket_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grocery_Order" ADD CONSTRAINT "Grocery_Order_ot_id_fkey" FOREIGN KEY ("ot_id") REFERENCES "Order_Ticket"("ot_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grocery_Order" ADD CONSTRAINT "Grocery_Order_lp_id_fkey" FOREIGN KEY ("lp_id") REFERENCES "Listed_Product"("lp_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listed_Product" ADD CONSTRAINT "Listed_Product_SKU_fkey" FOREIGN KEY ("SKU") REFERENCES "Grocery"("SKU") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listed_Product" ADD CONSTRAINT "Listed_Product_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "Supply_Item"("batch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_SKU_fkey" FOREIGN KEY ("SKU") REFERENCES "Grocery"("SKU") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CouponToOrder_Ticket" ADD CONSTRAINT "_CouponToOrder_Ticket_A_fkey" FOREIGN KEY ("A") REFERENCES "Coupon"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CouponToOrder_Ticket" ADD CONSTRAINT "_CouponToOrder_Ticket_B_fkey" FOREIGN KEY ("B") REFERENCES "Order_Ticket"("ot_id") ON DELETE CASCADE ON UPDATE CASCADE;
