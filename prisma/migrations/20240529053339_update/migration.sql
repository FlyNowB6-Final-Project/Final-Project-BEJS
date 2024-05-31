/*
  Warnings:

  - You are about to drop the column `order_id` on the `payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[payment_id]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[identity_number]` on the table `passengers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `payment_id` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Made the column `age_group` on table `passengers` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_order_id_fkey";

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "payment_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "passengers" ALTER COLUMN "age_group" SET NOT NULL,
ALTER COLUMN "birth_date" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "order_id";

-- CreateIndex
CREATE UNIQUE INDEX "orders_payment_id_key" ON "orders"("payment_id");

-- CreateIndex
CREATE UNIQUE INDEX "passengers_identity_number_key" ON "passengers"("identity_number");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
