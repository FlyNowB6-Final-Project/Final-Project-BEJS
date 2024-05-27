/*
  Warnings:

  - You are about to drop the column `destination` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `payment` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `passport` on the `passengers` table. All the data in the column will be lost.
  - You are about to drop the column `seri` on the `planes` table. All the data in the column will be lost.
  - You are about to drop the column `avatar` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `class` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `contients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `schedules` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[code]` on the table `cities` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `countries` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[payment_id]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[identity_number]` on the table `passengers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[series]` on the table `planes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `airport_name` to the `cities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country_id` to the `cities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `continent_id` to the `countries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `detail_flight_id` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expired_paid` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_id` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `age_group` to the `passengers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expired_date` to the `passengers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `family_name` to the `passengers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `identity_number` to the `passengers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issuing_country` to the `passengers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nationality` to the `passengers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_id` to the `passengers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `passengers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `airlinesId` to the `planes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `series` to the `planes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cities" ADD COLUMN     "airport_name" TEXT NOT NULL,
ADD COLUMN     "country_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "countries" ADD COLUMN     "continent_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "destination",
DROP COLUMN "payment",
ADD COLUMN     "detail_flight_id" INTEGER NOT NULL,
ADD COLUMN     "expired_paid" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "payment_id" INTEGER NOT NULL,
ADD COLUMN     "user_id" INTEGER;

-- AlterTable
ALTER TABLE "passengers" DROP COLUMN "passport",
ADD COLUMN     "age_group" INTEGER NOT NULL,
ADD COLUMN     "expired_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "family_name" TEXT NOT NULL,
ADD COLUMN     "identity_number" TEXT NOT NULL,
ADD COLUMN     "identity_type" TEXT,
ADD COLUMN     "issuing_country" TEXT NOT NULL,
ADD COLUMN     "nationality" TEXT NOT NULL,
ADD COLUMN     "order_id" INTEGER NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "gender" DROP NOT NULL;

-- AlterTable
ALTER TABLE "planes" DROP COLUMN "seri",
ADD COLUMN     "airlinesId" INTEGER NOT NULL,
ADD COLUMN     "series" TEXT NOT NULL,
ALTER COLUMN "brand" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "avatar",
ADD COLUMN     "avatar_url" TEXT,
ADD COLUMN     "family_name" TEXT,
ADD COLUMN     "otp" TEXT;

-- DropTable
DROP TABLE "class";

-- DropTable
DROP TABLE "contients";

-- DropTable
DROP TABLE "schedules";

-- CreateTable
CREATE TABLE "flights" (
    "id" SERIAL NOT NULL,
    "flight_number" TEXT NOT NULL,
    "time_arrive" TIMESTAMP(3) NOT NULL,
    "time_departure" TIMESTAMP(3) NOT NULL,
    "date_flight" TIMESTAMP(3) NOT NULL,
    "flight_estimation" TEXT NOT NULL,
    "city_arrive_id" INTEGER NOT NULL,
    "city_destination_id" INTEGER NOT NULL,

    CONSTRAINT "flights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detail_flight" (
    "id" SERIAL NOT NULL,
    "price" TEXT NOT NULL,
    "flight_id" INTEGER,
    "plane_id" INTEGER,

    CONSTRAINT "detail_flight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detail_plane" (
    "id" SERIAL NOT NULL,
    "total_seat" INTEGER NOT NULL,
    "seat_class_id" INTEGER NOT NULL,
    "plane_id" INTEGER NOT NULL,

    CONSTRAINT "detail_plane_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airlines" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "since" TEXT NOT NULL,
    "logo_url" TEXT NOT NULL,
    "plane_id" INTEGER,

    CONSTRAINT "airlines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seat_class" (
    "id" SERIAL NOT NULL,
    "type_class" TEXT NOT NULL,

    CONSTRAINT "Seat_class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "continents" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "continents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "flights_flight_number_key" ON "flights"("flight_number");

-- CreateIndex
CREATE UNIQUE INDEX "airlines_code_key" ON "airlines"("code");

-- CreateIndex
CREATE UNIQUE INDEX "continents_code_key" ON "continents"("code");

-- CreateIndex
CREATE UNIQUE INDEX "cities_code_key" ON "cities"("code");

-- CreateIndex
CREATE UNIQUE INDEX "countries_code_key" ON "countries"("code");

-- CreateIndex
CREATE UNIQUE INDEX "orders_code_key" ON "orders"("code");

-- CreateIndex
CREATE UNIQUE INDEX "orders_payment_id_key" ON "orders"("payment_id");

-- CreateIndex
CREATE UNIQUE INDEX "passengers_identity_number_key" ON "passengers"("identity_number");

-- CreateIndex
CREATE UNIQUE INDEX "planes_series_key" ON "planes"("series");

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_city_arrive_id_fkey" FOREIGN KEY ("city_arrive_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_city_destination_id_fkey" FOREIGN KEY ("city_destination_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_flight" ADD CONSTRAINT "detail_flight_flight_id_fkey" FOREIGN KEY ("flight_id") REFERENCES "flights"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_flight" ADD CONSTRAINT "detail_flight_plane_id_fkey" FOREIGN KEY ("plane_id") REFERENCES "planes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planes" ADD CONSTRAINT "planes_airlinesId_fkey" FOREIGN KEY ("airlinesId") REFERENCES "airlines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_plane" ADD CONSTRAINT "detail_plane_seat_class_id_fkey" FOREIGN KEY ("seat_class_id") REFERENCES "Seat_class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_plane" ADD CONSTRAINT "detail_plane_plane_id_fkey" FOREIGN KEY ("plane_id") REFERENCES "planes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passengers" ADD CONSTRAINT "passengers_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "countries" ADD CONSTRAINT "countries_continent_id_fkey" FOREIGN KEY ("continent_id") REFERENCES "continents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_detail_flight_id_fkey" FOREIGN KEY ("detail_flight_id") REFERENCES "detail_flight"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
