/*
  Warnings:

  - You are about to drop the column `date_flight` on the `CronJobSchedule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CronJobSchedule" DROP COLUMN "date_flight",
ADD COLUMN     "isFriday" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isMonday" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isSaturday" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isSunday" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isThuesday" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isThursday" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isWednesday" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "DetailCronJobSchedul" (
    "id" SERIAL NOT NULL,
    "flight_id" INTEGER,
    "price" INTEGER NOT NULL,
    "detail_plane_id" INTEGER NOT NULL,
    "cron_job_Schedule_id" INTEGER,

    CONSTRAINT "DetailCronJobSchedul_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DetailCronJobSchedul" ADD CONSTRAINT "DetailCronJobSchedul_detail_plane_id_fkey" FOREIGN KEY ("detail_plane_id") REFERENCES "detail_plane"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailCronJobSchedul" ADD CONSTRAINT "DetailCronJobSchedul_flight_id_fkey" FOREIGN KEY ("flight_id") REFERENCES "flights"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailCronJobSchedul" ADD CONSTRAINT "DetailCronJobSchedul_cron_job_Schedule_id_fkey" FOREIGN KEY ("cron_job_Schedule_id") REFERENCES "CronJobSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
