/*
  Warnings:

  - You are about to drop the `DetailFlight` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DetailPlane` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SeatClass` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DetailFlight" DROP CONSTRAINT "DetailFlight_detail_plane_id_fkey";

-- DropForeignKey
ALTER TABLE "DetailFlight" DROP CONSTRAINT "DetailFlight_flight_id_fkey";

-- DropForeignKey
ALTER TABLE "DetailPlane" DROP CONSTRAINT "DetailPlane_plane_id_fkey";

-- DropForeignKey
ALTER TABLE "DetailPlane" DROP CONSTRAINT "DetailPlane_seat_class_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_detail_flight_id_fkey";

-- DropTable
DROP TABLE "DetailFlight";

-- DropTable
DROP TABLE "DetailPlane";

-- DropTable
DROP TABLE "SeatClass";

-- CreateTable
CREATE TABLE "detail_flight" (
    "id" SERIAL NOT NULL,
    "price" INTEGER NOT NULL,
    "flight_id" INTEGER,
    "detail_plane_id" INTEGER NOT NULL,

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
CREATE TABLE "seat_class" (
    "id" SERIAL NOT NULL,
    "type_class" TEXT NOT NULL,

    CONSTRAINT "seat_class_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "detail_flight" ADD CONSTRAINT "detail_flight_flight_id_fkey" FOREIGN KEY ("flight_id") REFERENCES "flights"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_flight" ADD CONSTRAINT "detail_flight_detail_plane_id_fkey" FOREIGN KEY ("detail_plane_id") REFERENCES "detail_plane"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_plane" ADD CONSTRAINT "detail_plane_seat_class_id_fkey" FOREIGN KEY ("seat_class_id") REFERENCES "seat_class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_plane" ADD CONSTRAINT "detail_plane_plane_id_fkey" FOREIGN KEY ("plane_id") REFERENCES "planes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_detail_flight_id_fkey" FOREIGN KEY ("detail_flight_id") REFERENCES "detail_flight"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
