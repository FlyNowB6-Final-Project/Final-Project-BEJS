/*
  Warnings:

  - You are about to drop the column `detailPlaneId` on the `detail_flight` table. All the data in the column will be lost.
  - Added the required column `detail_plane_id` to the `detail_flight` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "detail_flight" DROP CONSTRAINT "detail_flight_detailPlaneId_fkey";

-- AlterTable
ALTER TABLE "detail_flight" DROP COLUMN "detailPlaneId",
ADD COLUMN     "detail_plane_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "detail_flight" ADD CONSTRAINT "detail_flight_detail_plane_id_fkey" FOREIGN KEY ("detail_plane_id") REFERENCES "detail_plane"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
