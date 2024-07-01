-- CreateTable
CREATE TABLE "CronJobSchedule" (
    "id" SERIAL NOT NULL,
    "flight_number" TEXT NOT NULL,
    "time_arrive" TIME(6) NOT NULL,
    "time_departure" TIME(6) NOT NULL,
    "date_flight" DATE NOT NULL,
    "city_arrive_id" INTEGER NOT NULL,
    "city_destination_id" INTEGER NOT NULL,
    "estimation_minute" INTEGER NOT NULL,
    "discount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CronJobSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CronJobSchedule_flight_number_key" ON "CronJobSchedule"("flight_number");

-- AddForeignKey
ALTER TABLE "CronJobSchedule" ADD CONSTRAINT "CronJobSchedule_city_arrive_id_fkey" FOREIGN KEY ("city_arrive_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CronJobSchedule" ADD CONSTRAINT "CronJobSchedule_city_destination_id_fkey" FOREIGN KEY ("city_destination_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
