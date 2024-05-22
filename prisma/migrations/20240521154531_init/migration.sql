-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "fullname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "google_id" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "role" TEXT NOT NULL DEFAULT 'user',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedules" (
    "id" SERIAL NOT NULL,
    "time_arrive" TIMESTAMP(3) NOT NULL,
    "time_departure" TIMESTAMP(3) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "seri" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,

    CONSTRAINT "planes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passengers" (
    "id" SERIAL NOT NULL,
    "fullname" TEXT NOT NULL,
    "birth_date" TEXT NOT NULL,
    "passport" TEXT NOT NULL,
    "gender" TEXT NOT NULL,

    CONSTRAINT "passengers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contients" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "contients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" TEXT NOT NULL,

    CONSTRAINT "class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "destination" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'unpaid',
    "code" TEXT NOT NULL,
    "payment" TEXT NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "amount" TEXT NOT NULL,
    "method_payment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
