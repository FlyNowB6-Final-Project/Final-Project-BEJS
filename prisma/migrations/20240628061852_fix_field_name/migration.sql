/*
  Warnings:

  - You are about to drop the column `flight_number` on the `cron_job_schedule` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[flight_key]` on the table `cron_job_schedule` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `flight_key` to the `cron_job_schedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "cron_job_schedule_flight_number_key";

-- AlterTable
ALTER TABLE "cron_job_schedule" DROP COLUMN "flight_number",
ADD COLUMN     "flight_key" TEXT NOT NULL,
ALTER COLUMN "isMonday" SET DEFAULT false,
ALTER COLUMN "isThuesday" SET DEFAULT false,
ALTER COLUMN "isWednesday" SET DEFAULT false,
ALTER COLUMN "isThursday" SET DEFAULT false,
ALTER COLUMN "isFriday" SET DEFAULT false,
ALTER COLUMN "isSaturday" SET DEFAULT false,
ALTER COLUMN "isSunday" SET DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "cron_job_schedule_flight_key_key" ON "cron_job_schedule"("flight_key");
