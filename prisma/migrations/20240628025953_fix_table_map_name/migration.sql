/*
  Warnings:

  - You are about to drop the `CronJobSchedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DetailCronJobSchedul` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CronJobSchedule" DROP CONSTRAINT "CronJobSchedule_city_arrive_id_fkey";

-- DropForeignKey
ALTER TABLE "CronJobSchedule" DROP CONSTRAINT "CronJobSchedule_city_destination_id_fkey";

-- DropForeignKey
ALTER TABLE "DetailCronJobSchedul" DROP CONSTRAINT "DetailCronJobSchedul_cron_job_Schedule_id_fkey";

-- DropForeignKey
ALTER TABLE "DetailCronJobSchedul" DROP CONSTRAINT "DetailCronJobSchedul_detail_plane_id_fkey";

-- DropForeignKey
ALTER TABLE "DetailCronJobSchedul" DROP CONSTRAINT "DetailCronJobSchedul_flight_id_fkey";

-- DropTable
DROP TABLE "CronJobSchedule";

-- DropTable
DROP TABLE "DetailCronJobSchedul";

-- CreateTable
CREATE TABLE "cron_job_schedule" (
    "id" SERIAL NOT NULL,
    "flight_number" TEXT NOT NULL,
    "time_arrive" TIME(6) NOT NULL,
    "time_departure" TIME(6) NOT NULL,
    "city_arrive_id" INTEGER NOT NULL,
    "city_destination_id" INTEGER NOT NULL,
    "estimation_minute" INTEGER NOT NULL,
    "discount" INTEGER NOT NULL DEFAULT 0,
    "isMonday" BOOLEAN NOT NULL DEFAULT true,
    "isThuesday" BOOLEAN NOT NULL DEFAULT true,
    "isWednesday" BOOLEAN NOT NULL DEFAULT true,
    "isThursday" BOOLEAN NOT NULL DEFAULT true,
    "isFriday" BOOLEAN NOT NULL DEFAULT true,
    "isSaturday" BOOLEAN NOT NULL DEFAULT true,
    "isSunday" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "cron_job_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detail_cron_job_schedul" (
    "id" SERIAL NOT NULL,
    "flight_id" INTEGER,
    "price" INTEGER NOT NULL,
    "detail_plane_id" INTEGER NOT NULL,
    "cron_job_Schedule_id" INTEGER,

    CONSTRAINT "detail_cron_job_schedul_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cron_job_schedule_flight_number_key" ON "cron_job_schedule"("flight_number");

-- AddForeignKey
ALTER TABLE "cron_job_schedule" ADD CONSTRAINT "cron_job_schedule_city_arrive_id_fkey" FOREIGN KEY ("city_arrive_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cron_job_schedule" ADD CONSTRAINT "cron_job_schedule_city_destination_id_fkey" FOREIGN KEY ("city_destination_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_cron_job_schedul" ADD CONSTRAINT "detail_cron_job_schedul_detail_plane_id_fkey" FOREIGN KEY ("detail_plane_id") REFERENCES "detail_plane"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_cron_job_schedul" ADD CONSTRAINT "detail_cron_job_schedul_flight_id_fkey" FOREIGN KEY ("flight_id") REFERENCES "flights"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_cron_job_schedul" ADD CONSTRAINT "detail_cron_job_schedul_cron_job_Schedule_id_fkey" FOREIGN KEY ("cron_job_Schedule_id") REFERENCES "cron_job_schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
