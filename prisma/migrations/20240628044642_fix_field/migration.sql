/*
  Warnings:

  - You are about to drop the column `flight_id` on the `detail_cron_job_schedul` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "detail_cron_job_schedul" DROP CONSTRAINT "detail_cron_job_schedul_flight_id_fkey";

-- AlterTable
ALTER TABLE "detail_cron_job_schedul" DROP COLUMN "flight_id";
