/*
  Warnings:

  - You are about to drop the column `flight_estimation` on the `flights` table. All the data in the column will be lost.
  - Added the required column `estimation_minute` to the `flights` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "flights" DROP COLUMN "flight_estimation",
ADD COLUMN     "estimation_minute" INTEGER NOT NULL;
