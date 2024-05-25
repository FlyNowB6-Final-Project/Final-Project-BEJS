/*
  Warnings:

  - You are about to drop the column `plane_id` on the `detail_flight` table. All the data in the column will be lost.
  - Added the required column `detailPlaneId` to the `detail_flight` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "detail_flight" DROP CONSTRAINT "detail_flight_plane_id_fkey";

-- AlterTable
ALTER TABLE "detail_flight" DROP COLUMN "plane_id",
ADD COLUMN     "detailPlaneId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "detail_flight" ADD CONSTRAINT "detail_flight_detailPlaneId_fkey" FOREIGN KEY ("detailPlaneId") REFERENCES "detail_plane"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
