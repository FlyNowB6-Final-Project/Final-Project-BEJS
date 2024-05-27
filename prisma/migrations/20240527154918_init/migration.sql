/*
  Warnings:

  - You are about to drop the `detail_flight` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `detail_plane` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `seat_class` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "detail_flight" DROP CONSTRAINT "detail_flight_detail_plane_id_fkey";

-- DropForeignKey
ALTER TABLE "detail_flight" DROP CONSTRAINT "detail_flight_flight_id_fkey";

-- DropForeignKey
ALTER TABLE "detail_plane" DROP CONSTRAINT "detail_plane_plane_id_fkey";

-- DropForeignKey
ALTER TABLE "detail_plane" DROP CONSTRAINT "detail_plane_seat_class_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_detail_flight_id_fkey";

-- DropTable
DROP TABLE "detail_flight";

-- DropTable
DROP TABLE "detail_plane";

-- DropTable
DROP TABLE "seat_class";

-- CreateTable
CREATE TABLE "DetailFlight" (
    "id" SERIAL NOT NULL,
    "price" INTEGER NOT NULL,
    "flight_id" INTEGER,
    "detail_plane_id" INTEGER NOT NULL,

    CONSTRAINT "DetailFlight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailPlane" (
    "id" SERIAL NOT NULL,
    "total_seat" INTEGER NOT NULL,
    "seat_class_id" INTEGER NOT NULL,
    "plane_id" INTEGER NOT NULL,

    CONSTRAINT "DetailPlane_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeatClass" (
    "id" SERIAL NOT NULL,
    "type_class" TEXT NOT NULL,

    CONSTRAINT "SeatClass_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DetailFlight" ADD CONSTRAINT "DetailFlight_flight_id_fkey" FOREIGN KEY ("flight_id") REFERENCES "flights"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailFlight" ADD CONSTRAINT "DetailFlight_detail_plane_id_fkey" FOREIGN KEY ("detail_plane_id") REFERENCES "DetailPlane"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailPlane" ADD CONSTRAINT "DetailPlane_seat_class_id_fkey" FOREIGN KEY ("seat_class_id") REFERENCES "SeatClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailPlane" ADD CONSTRAINT "DetailPlane_plane_id_fkey" FOREIGN KEY ("plane_id") REFERENCES "planes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_detail_flight_id_fkey" FOREIGN KEY ("detail_flight_id") REFERENCES "DetailFlight"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
