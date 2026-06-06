-- CreateEnum
CREATE TYPE "User_Coupon_Status" AS ENUM ('UNREDEEMED', 'REDEEMED');

-- CreateTable
CREATE TABLE "User_Coupon" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "coupon_id" TEXT NOT NULL,
    "status" "User_Coupon_Status" NOT NULL DEFAULT 'UNREDEEMED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coupon_Usage_History" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "coupon_id" TEXT NOT NULL,
    "ot_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coupon_Usage_History_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Coupon_user_id_coupon_id_key" ON "User_Coupon"("user_id", "coupon_id");

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_Usage_History_user_id_coupon_id_ot_id_key" ON "Coupon_Usage_History"("user_id", "coupon_id", "ot_id");

-- AddForeignKey
ALTER TABLE "User_Coupon" ADD CONSTRAINT "User_Coupon_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Coupon" ADD CONSTRAINT "User_Coupon_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "Coupon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coupon_Usage_History" ADD CONSTRAINT "Coupon_Usage_History_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coupon_Usage_History" ADD CONSTRAINT "Coupon_Usage_History_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "Coupon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coupon_Usage_History" ADD CONSTRAINT "Coupon_Usage_History_ot_id_fkey" FOREIGN KEY ("ot_id") REFERENCES "Order_Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
