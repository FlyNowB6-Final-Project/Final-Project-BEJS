/*
  Warnings:

  - You are about to drop the column `payment_id` on the `orders` table. All the data in the column will be lost.
  - Changed the type of `birth_date` on the `passengers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `order_id` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_payment_id_fkey";

-- DropIndex
DROP INDEX "orders_payment_id_key";

-- DropIndex
DROP INDEX "passengers_identity_number_key";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "payment_id";

-- AlterTable
ALTER TABLE "passengers" DROP COLUMN "birth_date",
ADD COLUMN     "birth_date" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "age_group" DROP NOT NULL;

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "order_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
