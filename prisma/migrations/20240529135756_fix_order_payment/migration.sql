/*
  Warnings:

  - You are about to drop the column `payment_id` on the `orders` table. All the data in the column will be lost.
  - Added the required column `order_id` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_payment_id_fkey";

-- DropIndex
DROP INDEX "orders_payment_id_key";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "payment_id";

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "order_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
