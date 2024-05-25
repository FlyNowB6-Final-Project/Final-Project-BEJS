/*
  Warnings:

  - You are about to drop the `Seat_class` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "detail_plane" DROP CONSTRAINT "detail_plane_seat_class_id_fkey";

-- DropTable
DROP TABLE "Seat_class";

-- CreateTable
CREATE TABLE "seat_class" (
    "id" SERIAL NOT NULL,
    "type_class" TEXT NOT NULL,

    CONSTRAINT "seat_class_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "detail_plane" ADD CONSTRAINT "detail_plane_seat_class_id_fkey" FOREIGN KEY ("seat_class_id") REFERENCES "seat_class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
