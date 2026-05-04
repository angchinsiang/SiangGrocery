/*
  Warnings:

  - The `country` column on the `Address` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `price` on the `Listed_Product` table. All the data in the column will be lost.
  - Added the required column `discount_price` to the `Listed_Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `original_price` to the `Listed_Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Country" AS ENUM ('Argentina', 'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada', 'Chile', 'China', 'Colombia', 'Denmark', 'Ecuador', 'Egypt', 'France', 'Germany', 'Greece', 'India', 'Indonesia', 'Ireland', 'Italy', 'Japan', 'Kenya', 'Malaysia', 'Mexico', 'Morocco', 'Netherlands', 'NewZealand', 'Nigeria', 'Norway', 'Pakistan', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Russia', 'SaudiArabia', 'Singapore', 'SouthAfrica', 'SouthKorea', 'Spain', 'Sweden', 'Switzerland', 'Taiwan', 'Thailand', 'Turkey', 'UnitedArabEmirates', 'UnitedKingdom', 'UnitedStates', 'Uruguay', 'Vietnam');

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "country",
ADD COLUMN     "country" "Country" NOT NULL DEFAULT 'Australia';

-- AlterTable
ALTER TABLE "Grocery" ADD COLUMN     "country" "Country" NOT NULL DEFAULT 'Australia';

-- AlterTable
ALTER TABLE "Listed_Product" DROP COLUMN "price",
ADD COLUMN     "discount_price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "original_price" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Supplier" ADD COLUMN     "country" "Country" NOT NULL DEFAULT 'Australia';

-- AlterTable
ALTER TABLE "Supply_Item" ADD COLUMN     "country" "Country" NOT NULL DEFAULT 'Australia';
